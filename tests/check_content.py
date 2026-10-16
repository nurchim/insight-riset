"""Smoke tests untuk konten pembelajaran statis tanpa dependensi npm."""
import json,re,pathlib,collections
P=pathlib.Path(__file__).resolve().parents[1]
data=(P/'data.js').read_text()
d=json.loads(data.split('=',1)[1].strip().rstrip(';'))
assert len(d['titles'])==32
assert [x['id'] for x in d['titles']]==list(range(1,33))
assert len(d['labels'])==7
counts=collections.Counter(x['category'] for x in d['titles'])
assert counts=={'si':12,'iot':6,'analytics':5,'cross':4,'media':2,'integration':2,'security':1},counts
assert len(d['transformations'])==8
for item in d['transformations']:
 for key in ['id','label','s1','s2','s3','gap','proof']:assert item.get(key), (item['id'],key)
assert len(d['references'])>=3
html=(P/'index.html').read_text()
for x in ['beranda','ringkasan','jenjang','peta-judul','transformasi','laboratorium','referensi']:
 assert f'id="{x}"' in html
for f in ['app.js','data.js','styles.css']:
 assert (P/f).exists()
assert not any((P/f).exists() for f in ['schema.sql','migration_v2.sql','.env.example','package.json'])
assert not re.search(r'supabase|POSTTEST|PRETEST|api/\[', (P/'app.js').read_text(), re.I)
print('OK — 32 judul, 7 tema, 8 studi kasus, 3 referensi, tanpa database/pretest/posttest.')
