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
        const next = {
          number: data.version || APP_VERSION,
          codename: data.codename || CODENAME,
          build: data.build || BUILD_TYPE,
          announcement: data.announcement || null,
        };

        setVersionData((prev) => {
          if (
            prev.number === next.number &&
            prev.codename === next.codename &&
            prev.build === next.build &&
            JSON.stringify(prev.announcement || null) === JSON.stringify(next.announcement || null)
          ) {
            return prev;
          }
          return next;
        });
      }
    };

    sysRef.on("value", handle);
    return () => sysRef.off("value", handle);
  }, []);

  return versionData;
}