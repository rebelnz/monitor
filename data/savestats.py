#! usr/bin/ python
import sqlite3 
import sys
import psutil
import simplejson
import time

# kept verbose for readability!

def runinsert():
    cpu_usage  = psutil.cpu_percent()
    mem_usage  = psutil.phymem_usage().percent    
    disk_usage = psutil.disk_usage('/').percent
    virtual    = psutil.virtmem_usage().percent
    network    = simplejson.dumps(psutil.network_io_counters(True))

    conn = sqlite3.connect('stats.db')
    cur = conn.cursor()

    cur.execute("DELETE FROM stats WHERE timestamp < datetime('now','localtime','-7 days')")
    # cur.execute("DELETE FROM stats WHERE timestamp < datetime('now', 'localtime','-1 hour')")

    conn.commit()

    cur.execute("INSERT INTO stats (cpu, memory, disk, virtual, network) VALUES (?, ?, ?, ?, ? )", 
                (cpu_usage, mem_usage, disk_usage, virtual, network))


    # DUBUG
    # cur.execute("SELECT * FROM stats")
    # print(cur.fetchall()) 

    conn.commit()
    conn.close()

if __name__ == "__main__":
    while True:
        runinsert()
        time.sleep(600) # run every 10 minutes
        # time.sleep(5)# run every 5 seconds
