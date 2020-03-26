#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

from sys import argv
import argparse

import json

import pywaves as pw
import pandas as pd

parseConfig = lambda x: {"owner": x.split("_")[1], "receiver": x.split("_")[3], "share": x.split("_")[2]}
filterConfigs = lambda cfgs: [x for x in cfgs if x["owner"] != x["receiver"]]

def accountsAggregator(payments):
    arr = []
    for a in set([p["recipient"] for p in payments]):
        arr.append({
            "recipient": a,
            "amount": sum([x["amount"] for x in payments if x["recipient"] == a])
        })
    return arr

def refferalWizard(payments, configs):
    direct = []
    ref = []
    for p in accountsAggregator(payments):
        ppmt = p["amount"]
        for c in configs:
            if p["recipient"] == c["owner"]:
                share = int(c["share"])/100
                ref.append({
                    "recipient": c["receiver"],
                    "amount": int(ppmt*share)
                })
                ppmt = int(ppmt*(1 - share))
        direct.append({
            "recipient": p["recipient"],
            "amount": ppmt
        })
    return {
        "direct": direct,
        "ref": accountsAggregator(ref)
    }

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(json.dumps({
            'method': self.command,
            'path': self.path,
            'real_path': parsed_path.query,
            'query': parsed_path.query,
            'request_version': self.request_version,
            'protocol_version': self.protocol_version
        }).encode())
        return

    def do_POST(self):
        content_len = int(self.headers.get('content-length'))
        post_body = self.rfile.read(content_len)
        data = json.loads(post_body)

        datapayments = data["payments"]
        oracle = pw.Oracle(oracleAddress = '3PNikM6yp4NqcSU8guxQtmR5onr2D4e8yTJ')
        configs = oracle.getData(regex = 'stakingconfig_current_.*')

        fconfigs = filterConfigs(map(lambda x: parseConfig(x["value"]), configs))

        result = refferalWizard(datapayments, fconfigs)

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        self.wfile.write(json.dumps(result).encode())

        return

class ScriptUtils:
    @staticmethod
    def get_params():
        port = 8000

        # parser = argparse.ArgumentParser()
        # parser.add_argument('--nodeUrl')
        # args = parser.parse_args()

        if len(argv) > 0:
            port = int(argv[1])

        return [port]

if __name__ == '__main__':
    [port] = ScriptUtils.get_params()

    server = HTTPServer(('0.0.0.0', port), RequestHandler)
    print('Starting server at http://localhost:' + str(port))
    server.serve_forever()