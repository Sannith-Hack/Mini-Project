import re

file_path = 'server.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update db.connect to db.getConnection
old_connect = """db.connect((err) => {
    if (err) console.error('MySQL Connection Error:', err.message);
    else {
        db.query(dbSetupQuery, (err) => {
            if (err) console.error('DB Setup Error:', err.message);
            else console.log('Connected to MySQL and Database is ready.');
        });
    }
});"""
new_connect = """db.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL Connection Error:', err.message);
    } else {
        connection.query(dbSetupQuery, (err) => {
            connection.release();
            if (err) console.error('DB Setup Error:', err.message);
            else console.log('Connected to MySQL and Database is ready.');
        });
    }
});"""

content = content.replace(old_connect, new_connect)

# 2. Remove `db.query(`USE ${dbName}`, () => {` blocks
# It looks like:
#    db.query(`USE ${dbName}`, () => {
#        db.query(...);
#    });
# We can use regex to remove the wrapper.
pattern = re.compile(r"(\s*)db\.query\(`USE \$\{dbName\}`,\s*\(\)\s*=>\s*\{([\s\S]*?)\n\1\}\);")

def replacer(match):
    indent = match.group(1)
    inner_content = match.group(2)
    # the inner_content will have extra indentation, but we can just return it.
    return inner_content

content = pattern.sub(replacer, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("server.js updated successfully")
