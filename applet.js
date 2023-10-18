/*
  Trial version 1.0
*/
const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;

const AppletDir = imports.ui.appletManager.appletMeta['ProxyToggle@lomariavl'].path;
const ScriptProxyHelper = 'gproxy.sh';
const UUID = "ProxyToggle@lomariavl";

const ProxyModes = ["none", "manual"];

function MyApplet(orientation) {
  this._init(orientation);
}

MyApplet.prototype = {
  __proto__: Applet.IconApplet.prototype,

  _init: function (orientation) {
    global.log("Initializing ProxyToggle applet");
    try {
      Applet.IconApplet.prototype._init.call(this, orientation);
      let [res, out] = GLib.spawn_sync(null, ['/bin/bash', GLib.build_filenamev([AppletDir, ScriptProxyHelper])],
        null, 0, null);

      this._proxyMode = out.toString().slice(1, -2);

      if (this._proxyMode === "auto") {
        this._proxyMode = ProxyModes[0];
        global.log("Do not turn on automatic!");
      }

      this.set_applet_tooltip("Mode: " + this._proxyMode);
      this.set_applet_icon_name("proxy-" + this._proxyMode);
    } catch (e) {
      global.logError(e);
    }
  },

  switching_modes: function () {
    try {
      let [res, out] = GLib.spawn_sync(null, ['/bin/bash', GLib.build_filenamev([AppletDir, ScriptProxyHelper]),
                                       this._proxyMode], null, 0, null);
      this.set_applet_tooltip("Mode: " + this._proxyMode);
      this.set_applet_icon_name("proxy-" + this._proxyMode);

    } catch (e) {
      global.logError(e);
    }
  },

  on_applet_clicked: function (event) {

    if (this._proxyMode === ProxyModes[0]) {
      this._proxyMode = ProxyModes[1];
    } else if (this._proxyMode === ProxyModes[1]) {
      this._proxyMode = ProxyModes[0];
    }

    this.switching_modes();
  },

};

function main(metadata, orientation) {
  let myApplet = new MyApplet(orientation);
  return myApplet;
}
