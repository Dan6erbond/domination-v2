import json
from xml.dom import minidom

map = {
    "countries": list(),
    "ocean": ""
}

country_ids = set()

doc = minidom.parse("BlankMap-World.svg")

gs = doc.getElementsByTagName('g')
ps = doc.getElementsByTagName('path')

for g in gs:
    if "class" not in g.attributes or "landxx" not in g.attributes["class"].value:
        continue
    if len(g.getElementsByTagName('title')) == 0:
        continue
    if "id" not in g.attributes or g.attributes["id"].value in country_ids:
        continue

    name = g.getElementsByTagName('title')[0].firstChild.data
    id = g.attributes["id"].value
    if id == "fr":
        print("FRANCE")
    paths = [path.attributes["d"].value for path in g.getElementsByTagName('path')]
    circles = [{"r": circle.attributes["r"].value, "cy": circle.attributes["cy"].value, "cx": circle.attributes["cx"].value} for circle in g.getElementsByTagName('circle')]

    map["countries"].append({
        "name": name,
        "id": id,
        "paths": paths,
        "circles": circles
    })
    country_ids.add(id)

for p in ps:
    if "id" in p.attributes and p.attributes["id"].value == "ocean":
        map["ocean"] = p.attributes["d"].value
        continue

    if "class" not in p.attributes or "landxx" not in p.attributes["class"].value:
        continue
    if len(p.getElementsByTagName('title')) == 0:
        continue
    if "id" not in p.attributes or p.attributes["id"].value in country_ids:
        continue

    name = p.getElementsByTagName('title')[0].firstChild.data
    id = p.attributes["id"].value
    paths = [p.attributes["d"].value]

    map["countries"].append({
        "name": name,
        "id": id,
        "paths": paths,
        "circles": []
    })
    country_ids.add(id)

with open("BlankMap-World.json", "w+") as f:
    f.write(json.dumps(map, indent=4))
