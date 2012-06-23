#! usr/bin/ python
import sqlite3 
import sys

conn = sqlite3.connect('stats.db')
cur = conn.cursor()

cur.execute("CREATE TABLE stats (id INTEGER PRIMARY KEY, cpu INT, ram TEXT, disk TEXT, network TEXT, timestamp DATE DEFAULT (datetime('now','localtime')))")

conn.commit()
conn.close()

