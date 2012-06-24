import simplejson
import os
from sqlite3 import connect

import tornado.web
import tornado.httpserver
import tornado.ioloop
import tornado.options

from tornado.options import define,options

import uimodules
from psstats import PsutilStats # module to gather stat info


define('port', default=8888, help="Run on port", type=int)

class Application(tornado.web.Application):
    def __init__(self):

        self.psutilstats = PsutilStats()

        handlers = [
            (r"/",IndexHandler),
            (r"/summary",SummaryHandler),            
            (r"/topprocess",TopProcessHandler),            
            (r"/processdetails",ProcessDetailsHandler),            
            (r"/graphdata",GraphDataHandler),            
            ]
        
        settings = dict(
            template_path = os.path.join(os.path.dirname(__file__),'templates'),
            static_path = os.path.join(os.path.dirname(__file__),'static'),
            ui_modules=uimodules,
            debug = True
            )
        
        stats_db = os.path.join(os.path.dirname(__file__),'data/stats.db')
        conn = connect(stats_db)
        self.db = conn.cursor()
        
        tornado.web.Application.__init__(self,handlers,**settings)


class BaseHandler(tornado.web.RequestHandler):    
    @property
    def db(self):
        return self.application.db


class IndexHandler(BaseHandler):
    def get(self):    
        summary_data = self.application.psutilstats.loadSummaryData();
        uptime = self.application.psutilstats.loadCommandUptime();
        platform = self.application.psutilstats.loadPlatform();
        df = self.application.psutilstats.loadCommandDf();
        self.render('index.html', 
                    summary_data = summary_data, 
                    uptime = uptime,
                    platform = platform,
                    df = df)

class SummaryHandler(BaseHandler):
    def get(self):
        summary_data = self.application.psutilstats.loadSummaryData()
        self.write(simplejson.dumps(summary_data))        

class SummaryForGraphHandler(BaseHandler):
    def get(self):
        summary_data = self.application.psutilstats.loadSummaryData()
        self.write(simplejson.dumps(summary_data))        


class TopProcessHandler(BaseHandler):
    def get(self):
        limit = self.get_argument('limit')
        if limit == 'ALL':
            top_processes = self.application.psutilstats.getTopProcesses()
        else:
            top_processes = self.application.psutilstats.getTopProcesses(int(limit))

        self.write(simplejson.dumps(top_processes))


class ProcessDetailsHandler(BaseHandler):
    def get(self):
        pid = self.get_argument('pid')
        process_details = self.application.psutilstats.getProcessDetails(int(pid))
        # self.render('processdetails.html', process_details = process_details)
        self.write(simplejson.dumps(process_details))


class GraphDataHandler(BaseHandler):
    def get(self):
        item = self.get_argument('item')
        data = self.db.execute("SELECT %s, timestamp FROM stats" % item)
        stats_data = data.fetchall()
        stats_data[0] = item
        self.write(simplejson.dumps(stats_data))


if __name__ == '__main__':
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
    
