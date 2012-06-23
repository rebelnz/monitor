#! usr/bin/ python
import sqlite3 
import sys
import psutil
import simplejson
import time

def runinsert():
    cpu_usage  = psutil.cpu_percent()
    ram_usage  = simplejson.dumps(psutil.phymem_usage())
    disk_usage = simplejson.dumps(psutil.disk_usage('/'))
    network    = simplejson.dumps(psutil.network_io_counters(True))

    conn = sqlite3.connect('stats.db')
    cur = conn.cursor()
    cur.execute("INSERT INTO stats (cpu, ram, disk, network) VALUES (?, ?, ?, ? )", 
                ( cpu_usage, ram_usage, disk_usage, network))

    # DUBUG
    # cur.execute("SELECT * FROM stats")
    # print(cur.fetchall()) 

    conn.commit()
    conn.close()

if __name__ == "__main__":
    while True:
        runinsert()
        time.sleep(60)
