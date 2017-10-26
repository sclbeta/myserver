# coding:utf-8

import tornado.ioloop
import tornado.web
from kucun_in import InHandler
from motor import motor_tornado


class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render('index.html')

client = motor_tornado.MotorClient("192.168.241.129", 27017)
db = client.test_database

settings = {
    "template_path": "view",
    "static_path": "static",
    "db": db,
}

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/test/(.*)/(.*)", InHandler),
    (r"/test", InHandler)
], debug=True, **settings)


if __name__ == "__main__":
    application.listen(8001)
    tornado.ioloop.IOLoop.instance().start()
