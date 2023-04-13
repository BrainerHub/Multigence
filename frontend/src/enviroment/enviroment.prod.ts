export const environment = {
    production: true,
    api:
      window.location.host == '192.168.1.4:8080' || window.location.host == '127.0.0.1:8080' ? 'https://aid.v14.con4pas.cz/sap/bc/aginag/dynx_data' :
        window.location.protocol +
        "//" +
        window.location.host +
        "/sap/bc/aginag/dynx_data",
    logoutUrl: "/sap/public/bc/icf/logoff?sap-client=001&redirectURL=/dynamix_pw",
    uploadedbuildVersion: '2.35.0',
    buildVersion: '0007'
  };