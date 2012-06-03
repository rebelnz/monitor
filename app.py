import psutil
import os
import commands
import simplejson

import tornado.web
import tornado.httpserver
import tornado.ioloop
import tornado.options

import uimodules

from tornado.options import define,options

define('port', default=8888, help="Run on port", type=int)

class Application(tornado.web.Application):
    def __init__(self):

        self.psutilstats = PsutilStats()

        handlers = [
            (r"/",IndexHandler),
            (r"/summary",SummaryHandler),            
            (r"/topprocess",TopProcessHandler),            
            (r"/processdetails",ProcessDetailsHandler),            
            ]
        
        settings = dict(
            template_path = os.path.join(os.path.dirname(__file__),'templates'),
            static_path = os.path.join(os.path.dirname(__file__),'static'),
            ui_modules=uimodules,
            debug = True
            )
        
        tornado.web.Application.__init__(self,handlers,**settings)

class PsutilStats(object):

    def loadUptime(self):
        x = commands.getoutput('uptime')
        return x
        
    def loadSummaryData(self):
        summary_data = {}
        summary_data['cpu'] = [psutil.cpu_percent()]
        summary_data['memory'] = [psutil.phymem_usage().percent]
        summary_data['virtual'] = [psutil.virtmem_usage().percent]
        summary_data['disk'] = [psutil.disk_usage('/').percent]        
        summary_data['uptime'] = commands.getoutput('uptime')
        return summary_data

    def getTopProcesses(self,limit=10):
        m = {}
        for x in psutil.get_process_list():
            cpu_time = x.get_cpu_times()[1]
            if not cpu_time:
                continue
            k = x.pid; v = {"pid":x.pid, "name":x.name, "cpu_time":cpu_time}
            m[k] = v
        p = m.items()
        p.sort(key= lambda x: x[1]["cpu_time"],reverse=True)
        return p[0:limit]

    def getProcessDetails(self,pid):
        x = psutil.Process(pid)
        try:
            process_details = {}
            process_details['Status'] = str(x.status)
            process_details['Username'] = x.username
            process_details['Terminal'] = x.terminal
            process_details['IO Count'] = x.get_io_counters()
            process_details['CPU Times'] = x.get_cpu_times()
            process_details['Threads'] = x.get_threads()
            process_details['Memory'] = x.get_memory_info()
            process_details['Connections'] = x.get_connections()
        except: process_details = 'denied' #permissions
        # return x
        return process_details


class IndexHandler(tornado.web.RequestHandler):
    def get(self):    
        summary_data = self.application.psutilstats.loadSummaryData();
        uptime = self.application.psutilstats.loadUptime();
        self.render('index.html', 
                    summary_data = summary_data, 
                    uptime = uptime)

class SummaryHandler(tornado.web.RequestHandler):
    def get(self):
        summary_data = self.application.psutilstats.loadSummaryData()
        self.write(simplejson.dumps(summary_data))        

class TopProcessHandler(tornado.web.RequestHandler):
    def get(self):
        top_processes = self.application.psutilstats.getTopProcesses()
        self.write(simplejson.dumps(top_processes))


class ProcessDetailsHandler(tornado.web.RequestHandler):
    def get(self):
        pid = self.get_argument('pid')
        process_details = self.application.psutilstats.getProcessDetails(int(pid))
        # self.render('processdetails.html', process_details = process_details)
        self.write(simplejson.dumps(process_details))


if __name__ == '__main__':
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
    
