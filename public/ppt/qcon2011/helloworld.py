from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, \
                        Application

class MainHandler(RequestHandler):
    def get(self):
        self.write("Hello, world")

application = Application([
    (r"/", MainHandler),
])

if __name__ == "__main__":
    application.listen(8080)
    IOLoop.instance().start()