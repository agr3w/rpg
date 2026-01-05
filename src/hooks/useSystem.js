import { useState, useEffect } from "react";
import { database } from "APIs/firebaseConfig";
import { APP_VERSION, CODENAME, BUILD_TYPE } from "config/appVersion";

export function useSystem() {
  const [versionData, setVersionData] = useState({
    number: APP_VERSION,
    codename: CODENAME,
    build: BUILD_TYPE,
    announcement: null, // { message: "...", type: "warning" }
  });

  useEffect(() => {
    const sysRef = database.ref("system/metadata");
    
    const handle = (snap) => {
      const data = snap.val();
      if (data) {
        setVersionData({
          number: data.version || APP_VERSION,
          codename: data.codename || CODENAME,
          build: data.build || BUILD_TYPE,
          announcement: data.announcement || null,
        });
      }
    };

    sysRef.on("value", handle);
    return () => sysRef.off("value", handle);
  }, []);

  return versionData;
}