#coding:utf-8

import tornado.web
from tornado import gen
import time


class InHandler(tornado.web.RequestHandler):

    @gen.coroutine
    def get(self, device_id, date):

        if '-' in date:
            date = date.replace('-', '')
        print(date)
        db = self.settings['db']
        coll = db[device_id]

        doc = yield coll.find_one({'_id': date})
        if doc is not None:
            data = {
                "error": "0",
                "data": doc["data"]
            }
            self.write(data)
        else:
            data = {
                "error": "1",
                "data": "no result"
            }
            self.write(data)

    @gen.coroutine
    def post(self):

        db = self.settings['db']
        device_id = self.get_argument("i")

        coll = db[device_id]
        cur_data = {
            "data": self.get_argument("d"),
            "bat": self.get_argument("b")
        }
        timestamp = time.strftime('%Y-%m-%d', time.localtime(time.time()))
        doc = yield coll.find_one({'_id': timestamp})
        if doc is not None:
            doc["data"].append(cur_data)
            result = yield coll.update_one({'_id': timestamp}, {'$set': {'data': doc["data"]}})
            print(result)
        else:
            doc = {
                "_id": timestamp,
                "data": [cur_data]
            }
            coll.insert_one(doc)
        self.write(str(time.time()))
