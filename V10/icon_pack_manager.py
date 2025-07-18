import os
import json

class IconPackManager:
    def __init__(self, icon_packs_dir="IconPacks"):
        self.icon_packs_dir = icon_packs_dir
        self.packs = self.load_packs()

    def load_packs(self):
        packs = {}
        if not os.path.isdir(self.icon_packs_dir):
            return packs
        for folder in os.listdir(self.icon_packs_dir):
            pack_path = os.path.join(self.icon_packs_dir, folder)
            if os.path.isdir(pack_path):
                manifest_path = os.path.join(pack_path, "manifest.json")
                icons_path = os.path.join(pack_path, "icons.json")
                icons_dir = os.path.join(pack_path, "icons")
                manifest = {}
                icons = []
                if os.path.isfile(manifest_path):
                    with open(manifest_path, "r", encoding="utf-8") as f:
                        manifest = json.load(f)
                if os.path.isfile(icons_path):
                    with open(icons_path, "r", encoding="utf-8") as f:
                        icons = json.load(f)
                # Add absolute path to each icon
                for icon in icons:
                    icon["abs_path"] = os.path.join(icons_dir, icon["path"])
                packs[folder] = {
                    "manifest": manifest,
                    "icons": icons,
                    "folder": pack_path,
                }
        return packs

    def get_packs(self):
        return self.packs

    def get_icons(self, pack_name):
        return self.packs.get(pack_name, {}).get("icons", [])

    def search_icons(self, query):
        results = []
        for pack in self.packs.values():
            for icon in pack["icons"]:
                if query.lower() in icon["name"].lower():
                    results.append(icon)
        return results 