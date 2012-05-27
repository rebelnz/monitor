import tornado.web

class ProgressModule(tornado.web.UIModule):
    def render(self,k,v):
        return self.render_string('modules/progress.html',
                                  datakeys=k,
                                  datavals=v)

class GraphModule(tornado.web.UIModule):
    def render(self):
        return self.render_string('modules/graph.html')

    def javascript_files(self):
        scripts = []
        scripts.append("js/d3.v2.min.js")
        scripts.append("js/rickshaw.js")
        return scripts 

