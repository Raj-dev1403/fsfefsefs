import requests
import json
from lxml import etree
from io import BytesIO

# Map repo files to aircraft names
AAO_XML_FILES = {
    "Fenix A320": "AxisAndOhsScripts_FENIX_A3XX.xml",
    "FBW A320": "AxisAndOhsScripts_FBWA320.xml",
    "FBW A380": "FBW_A380_AxisAndOhsScripts.xml",
    "Ini A350": "iniBuilds_A350_aao.xml",
    "PMDG B777": "B777.xml",
    "PMDG B737": "AxisAndOhsScripts_PMDG737.xml",
    "Fenix Custom": "fnx320_scripts.xml"
}

REPO_RAW_BASE = "https://raw.githubusercontent.com/Raj-dev1403/fgdfgdfg/main/"

# Try to extract system/category from XML structure or label prefix
SYSTEM_KEYWORDS = [
    "ECAM", "Electrical", "Lights", "APU", "Engines", "Flight Controls", "Fuel", "Hydraulic", "MCDU", "Avionics", "Controls", "Anti-Ice", "ADIRS", "CPDLC", "EFIS", "ISIS", "Gear", "Autopilot", "Pressurization", "Air Conditioning"
]

def guess_system(label):
    for sys in SYSTEM_KEYWORDS:
        if sys.lower() in label.lower():
            return sys
    return "Other"

def parse_aao_xml(xml_content):
    root = etree.parse(BytesIO(xml_content)).getroot()
    scripts = []
    for elem in root.iter():
        if elem.tag.lower() == 'script':
            label = elem.getparent().findtext('label') if elem.getparent() is not None else None
            script_text = elem.text.strip() if elem.text else ''
            if label:
                scripts.append({"label": label.strip(), "script": script_text})
    return scripts

def build_db():
    db = {}
    for aircraft, filename in AAO_XML_FILES.items():
        url = REPO_RAW_BASE + filename
        print(f"Fetching {aircraft}: {url}")
        resp = requests.get(url)
        if resp.status_code != 200:
            print(f"Failed to fetch {filename}")
            continue
        scripts = parse_aao_xml(resp.content)
        # Group by system if possible
        systems = {}
        for entry in scripts:
            sys = guess_system(entry["label"])
            systems.setdefault(sys, []).append(entry)
        db[aircraft] = systems
    with open("aao_scripts_db.json", "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    print("aao_scripts_db.json generated.")

if __name__ == "__main__":
    build_db() 