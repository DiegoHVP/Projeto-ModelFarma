import sqlite3
from contextlib import contextmanager

#@contextmanager
def get_db_connection():
    conn = sqlite3.connect('dados_farmacia.db')
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def execute_query(conn, query: str, params: tuple = ()):
    cursor = conn.cursor()
    cursor.execute(query, params)
    conn.commit()  # Se você estiver fazendo alterações no banco de dados, certifique-se de fazer o commit
    return cursor

def fetch_query(conn, query: str, params: tuple = ()):
    cursor = execute_query(conn, query, params)
    return cursor.fetchall()
