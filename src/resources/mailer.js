module.exports = {
  generate: (name, link, title, detail, action, button_text) => {
    return `
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>replit</title>
            <link href="style.css" rel="stylesheet" type="text/css" />
            <style>
              #logo {
                padding: 10px;
                display: flex;
                flex-direction: row;
              }
  
              #logo .posinfinite {
                padding: 7px 15px;
                font-size: 20px;
                font-weight: 600;
              }
  
              .robotto {
                font-family: "Roboto", sans-serif;
              }
  
              .v-btn {
                align-items: center;
                border-radius: 4px;
                display: inline-flex;
                flex: 0 0 auto;
                font-weight: 500;
                justify-content: center;
                letter-spacing: .0892857143em;
                outline: 0;
                position: relative;
                text-decoration: none;
                text-indent: 0.0892857143em;
                text-transform: uppercase;
                transition-duration: .28s;
                transition-property: box-shadow,transform,opacity;
                user-select: none;
                vertical-align: middle;
                white-space: nowrap;
                background-color: rgb(62, 125, 171);
                text-transform: none;
                color: #fff;
                border: none;
                cursor: pointer;
              }
  
              body {
                width: 100%;
                display: flex;
                justify-content: center;
              }
            </style>
          </head>
  
          <body>
            <table align='center' style='text-align:center'>
              <tr>
                <td align='center' style='text-align:center'>
                  <div style="width: 400px; border: 1px solid lightgrey; border-radius: 8px; padding: 20px 20px 40px 20px;">
                    <div id="logo">
                      <img src="https://i.ibb.co/Z6nP8FZ/posinfinite-beta-1.png" style="width: 90px">
                      <div class="posinfinite robotto">${title}</div>
                    </div>
                    <div class="robotto">
                      <div style="padding: 0 12px;">
                        <hr role="separator" aria-orientation="horizontal" class="v-divider theme--light">
                      </div>
                      <div style="padding: 12px; text-align: left;">
                        Hi, ${name}
                      </div>
                  
                      <div style="padding: 12px; text-align: justify;">
                        ${detail} 
                        <div style="padding-top: 8px;">${action}</div>
                      </div>
                    </div>
                  
                    <center>
                      <a href="${link}" type="button" class="robotto v-btn" style="margin-top: 20px; text-align: center; padding: 12px 21px; background-color: rgb(62, 125, 171); text-transform: none; align-items: center; justify-content: center; color: white; place-content: center;">
                        <span style="align-self: center;">
                          ${button_text}
                        </span>
                      </a>
                    </center>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
  },
  subscription_renewal_email: () => {
    return `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>replit</title>
          <link href="style.css" rel="stylesheet" type="text/css" />
          <style>
            #logo {
              padding: 10px;
              display: flex;
              flex-direction: row;
            }

            #logo .posinfinite {
              padding: 7px 15px;
              font-size: 20px;
              font-weight: 600;
            }

            .robotto {
              font-family: "Roboto", sans-serif;
            }

            .v-btn {
              align-items: center;
              border-radius: 4px;
              display: inline-flex;
              flex: 0 0 auto;
              font-weight: 500;
              justify-content: center;
              letter-spacing: .0892857143em;
              outline: 0;
              position: relative;
              text-decoration: none;
              text-indent: 0.0892857143em;
              text-transform: uppercase;
              transition-duration: .28s;
              transition-property: box-shadow,transform,opacity;
              user-select: none;
              vertical-align: middle;
              white-space: nowrap;
              background-color: rgb(62, 125, 171);
              text-transform: none;
              color: #fff;
              border: none;
              cursor: pointer;
            }

            body {
              width: 100%;
              display: flex;
              justify-content: center;
            }
          </style>
        </head>

        <body>
          <div>Tes subscription renewal email</div>
        </body>
      </html>
    `;
  },

  register_otp(username, otp) {
    return `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Posinfinite OTP</title>
          <style>
            @font-face{font-family:Poppins;font-style:normal;font-display:swap;font-weight:100;src:local('Poppins Thin '),local('Poppins-Thin'),url(./files/poppins-latin-100.woff2) format('woff2'),url(./files/poppins-latin-100.woff) format('woff')}@font-face{font-family:Poppins;font-style:italic;font-display:swap;font-weight:100;src:local('Poppins Thin italic'),local('Poppins-Thinitalic'),url(./files/poppins-latin-100italic.woff2) format('woff2'),url(./files/poppins-latin-100italic.woff) format('woff')}@font-face{font-family:Poppins;font-style:normal;font-display:swap;font-weight:200;src:local('Poppins Extra Light '),local('Poppins-Extra Light'),url(./files/poppins-latin-200.woff2) format('woff2'),url(./files/poppins-latin-200.woff) format('woff')}@font-face{font-family:Poppins;font-style:italic;font-display:swap;font-weight:200;src:local('Poppins Extra Light italic'),local('Poppins-Extra Lightitalic'),url(./files/poppins-latin-200italic.woff2) format('woff2'),url(./files/poppins-latin-200italic.woff) format('woff')}@font-face{font-family:Poppins;font-style:normal;font-display:swap;font-weight:300;src:local('Poppins Light '),local('Poppins-Light'),url(./files/poppins-latin-300.woff2) format('woff2'),url(./files/poppins-latin-300.woff) format('woff')}@font-face{font-family:Poppins;font-style:italic;font-display:swap;font-weight:300;src:local('Poppins Light italic'),local('Poppins-Lightitalic'),url(./files/poppins-latin-300italic.woff2) format('woff2'),url(./files/poppins-latin-300italic.woff) format('woff')}@font-face{font-family:Poppins;font-style:normal;font-display:swap;font-weight:400;src:local('Poppins Regular '),local('Poppins-Regular'),url(./files/poppins-latin-400.woff2) format('woff2'),url(./files/poppins-latin-400.woff) format('woff')}@font-face{font-family:Poppins;font-style:italic;font-display:swap;font-weight:400;src:local('Poppins Regular italic'),local('Poppins-Regularitalic'),url(./files/poppins-latin-400italic.woff2) format('woff2'),url(./files/poppins-latin-400italic.woff) format('woff')}@font-face{font-family:Poppins;font-style:normal;font-display:swap;font-weight:500;src:local('Poppins Medium '),local('Poppins-Medium'),url(./files/poppins-latin-500.woff2) format('woff2'),url(./files/poppins-latin-500.woff) format('woff')}@font-face{font-family:Poppins;font-style:italic;font-display:swap;font-weight:500;src:local('Poppins Medium italic'),local('Poppins-Mediumitalic'),url(./files/poppins-latin-500italic.woff2) format('woff2'),url(./files/poppins-latin-500italic.woff) format('woff')}@font-face{font-family:Poppins;font-style:normal;font-display:swap;font-weight:600;src:local('Poppins SemiBold '),local('Poppins-SemiBold'),url(./files/poppins-latin-600.woff2) format('woff2'),url(./files/poppins-latin-600.woff) format('woff')}@font-face{font-family:Poppins;font-style:italic;font-display:swap;font-weight:600;src:local('Poppins SemiBold italic'),local('Poppins-SemiBolditalic'),url(./files/poppins-latin-600italic.woff2) format('woff2'),url(./files/poppins-latin-600italic.woff) format('woff')}@font-face{font-family:Poppins;font-style:normal;font-display:swap;font-weight:700;src:local('Poppins Bold '),local('Poppins-Bold'),url(./files/poppins-latin-700.woff2) format('woff2'),url(./files/poppins-latin-700.woff) format('woff')}@font-face{font-family:Poppins;font-style:italic;font-display:swap;font-weight:700;src:local('Poppins Bold italic'),local('Poppins-Bolditalic'),url(./files/poppins-latin-700italic.woff2) format('woff2'),url(./files/poppins-latin-700italic.woff) format('woff')}@font-face{font-family:Poppins;font-style:normal;font-display:swap;font-weight:800;src:local('Poppins ExtraBold '),local('Poppins-ExtraBold'),url(./files/poppins-latin-800.woff2) format('woff2'),url(./files/poppins-latin-800.woff) format('woff')}@font-face{font-family:Poppins;font-style:italic;font-display:swap;font-weight:800;src:local('Poppins ExtraBold italic'),local('Poppins-ExtraBolditalic'),url(./files/poppins-latin-800italic.woff2) format('woff2'),url(./files/poppins-latin-800italic.woff) format('woff')}@font-face{font-family:Poppins;font-style:normal;font-display:swap;font-weight:900;src:local('Poppins Black '),local('Poppins-Black'),url(./files/poppins-latin-900.woff2) format('woff2'),url(./files/poppins-latin-900.woff) format('woff')}@font-face{font-family:Poppins;font-style:italic;font-display:swap;font-weight:900;src:local('Poppins Black italic'),local('Poppins-Blackitalic'),url(./files/poppins-latin-900italic.woff2) format('woff2'),url(./files/poppins-latin-900italic.woff) format('woff')}
            body {
              font-family: 'Poppins', sans-serif;
            }

            #posinfinite-otp {
              max-width: 615px;
              padding: 45px 30px;
            }

            .posinfinite-line--bold {
              width: 100%;
              border-bottom: 4px solid #3E7DAB;
              margin: 25px 0 20px 0;
            }

            .posinfinite-line--thin {
              width: 100%;
              border-bottom: 1px solid #E0E5EA;
              margin: 25px 0 20px 0;
            }

            .posinfinite-greeting {
              font-size: 24px;
              font-weight: 500;
            }

            .welcome-to-join {
              margin-top: 20px;
              font-size: 14px;
              font-weight: 400;
              color: #1E1F23;
            }

            .otp-code {
              margin-top: 20px;
              font-size: 20px;
              font-weight: 500;
              background: #F5F5F5;
              width: 120px;
              padding: 10px 10px;
              text-align: center;
            }

            .regards {
              margin-top: 40px;
              font-size: 14px;
              font-weight: 500;
              color: #1E1F23;
            }

            .skite {
              margin-top: 20px;
              font-size: 14px;
              font-weight: 500;
              color: #1E1F23;
            }

            .information {
              margin-top: 20px;
              font-size: 12px;
              color: #58595F;
            }
          </style>
        </head>
        <body>
          <div id="posinfinite-otp">
            <a href="https://imgbb.com/"><img src="https://i.ibb.co/dKbNTCP/black-1.png" alt="black-1" border="0"></a>
            <div class="posinfinite-line--bold"></div>
            <div class="posinfinite-greeting">Dear ${username},</div>
            <div class="welcome-to-join">
              Thank you for signing up with us! To complete the registration process and ensure
              the security of your account, we need to verify your email address.
            </div>
            <div class="welcome-to-join">
              Please use the following OTP (One-Time Password) below to verify your email/account:
            </div>
            <div class="otp-code">${otp}</div>
            <div class="welcome-to-join">
              This code is only valid for 10 minutes. Do not share this code with anyone.
            </div>
            <div class="regards">
              <div>Regards,</div>
              <div>PosInfinite</div>
            </div>
            <div class="posinfinite-line--thin"></div>
            <div class="skite">
              Skite Social Pte. Ltd
            </div>
            <div class="information">
              Sahid Sudirman Center Level 23, Jalan Jendral Sudirman No. 86, Karet Tengsin, 
              Tanah Abang, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 10250
            </div>
            <div class="information">
              <div style="display: flex; flex-direction: row;">
                <img src="https://i.ibb.co/p4tyrBp/phone.png" alt="phone" border="0">
                <div style="align-self: center; padding-left: 8px;">
                  +62888888881111111
                </div>
              </div>
              <div style="display: flex; flex-direction: row; margin-top: 10px;">
                <img src="https://i.ibb.co/JHtdw1H/mail.png" alt="mail" border="0">
                <div style="align-self: center; padding-left: 8px;">
                  help.posinfinite@gmail.com
                </div>
              </div>
              <div class="posinfinite-line--thin"></div>
              <div style="display: flex; flex-direction: row;">
                <div>
                  <a href="https://imgbb.com/"><img src="https://i.ibb.co/xqmfdgb/youtube.png" alt="youtube" border="0"></a>
                </div>
                <div style="margin-left: 10px;">
                  <a href="https://imgbb.com/"><img src="https://i.ibb.co/RytQf42/linkedin.png" alt="linkedin" border="0"></a>
                </div>
                <div style="margin-left: 10px;">
                  <a href="https://imgbb.com/"><img src="https://i.ibb.co/Nx8sCXP/facebook.png" alt="facebook" border="0"></a>
                </div>
                <div style="margin-left: 10px;">
                  <a href="https://imgbb.com/"><img src="https://i.ibb.co/1vwG9bP/x-logo.png" alt="x-logo" border="0"></a>
                </div>
                <div style="margin-left: 10px;">
                  <a href="https://imgbb.com/"><img src="https://i.ibb.co/DzkScDQ/instagram.png" alt="instagram" border="0"></a>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  },
  postSuccessAddTripSchedule: (params) => {
    return `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>replit</title>
          <link href="style.css" rel="stylesheet" type="text/css" />
          <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              width: 100%;
              min-height: 100vh;
              display: flex;
              justify-content: center;
              background: white;
            }
      
            .container {
              width: 100%;
              min-height: 100%;
              height: max-content;
              max-width: 480px;
              position: relative;
              font-size: 10px;
            }
      
            #customers {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              border-collapse: collapse;
              width: 100%;
            }
      
            #customers td {
              font-weight: 400;
            }
      
            #customers td, #customers th {
              padding: 8px;
            }
      
            #customers tr:nth-child(even){background-color: white;}
      
            #customers tr:hover {background-color: #ddd;}
      
            #customers th {
              padding-top: 12px;
              padding-bottom: 12px;
              text-align: left;
              background-color: #F0F4F4;
              color: black;
            }
          </style>
        </head>
    
        <body>
          <div class="container">
            <div style="margin-bottom: 10px;">
              <img src="https://storage.googleapis.com/dailypos/thecare_Logo.png" style="display: block; margin-left: auto; margin-right: auto; width: auto; height: 95px;">
            </div>
            <div style="margin-bottom: 10px; height: 2px; width: 100%; background-color: #03B5A3;"></div>
      
            <div style="padding: 16px;">
              <div style="font-weight: 500; margin-bottom: 10px;">Dear The Care Team,</div>
              <div style="font-weight: 400; margin-bottom: 20px; color: #283238;">A new pickup and delivery order has been scheduled by a customer. Please find the details below:</div>
              <div style="font-weight: 600; margin-bottom: 5px;">Order ID ${params.transaction_id}</div>
      
              <div style="margin-bottom: 20px; display: flex; gap: 60px;">
                <div style="font-weight: 400; margin-right: 20px;">
                  <div style="margin-bottom: 5px;">Customer Name</div>
                  <div style="margin-bottom: 5px;">Customer Phone</div>
                  <div style="margin-bottom: 5px;">Customer Address</div>
                  <div style="margin-bottom: 5px;">Outlet</div>
                </div>
                <div style="font-weight: 400;">
                  <div style="margin-bottom: 5px;">: &nbsp;&nbsp; ${params.customer_name}</div>
                  <div style="margin-bottom: 5px;">: &nbsp;&nbsp; ${params.customer_phone}</div>
                  <div style="margin-bottom: 5px;">: &nbsp;&nbsp; ${params.customer_address}</div>
                  <div style="margin-bottom: 5px;">: &nbsp;&nbsp; ${params.outlet_name}</div>
                </div>
              </div>
      
              <div>
                <table cellpadding="5" cellspacing="0" border="0" style="width: 100%; height: 70px;">
                  <tr>
                    <td style="width: 49%; background-color: #E6FFFC; border-radius: 8px; padding: 10px;">
                      <div style="font-weight: 600;">Pickup Schedule</div>
                      <div style="margin-top: 8px; margin-bottom: 8px; font-weight: 500;">Date : ${params.pickupDate}</div>
                      <div style="font-weight: 500">Time : ${params.pickupTimeStart} - ${params.pickupTimeEnd}</div>
                    </td>
                    <td style="width: 2%; background-color: white;">
                    </td>
                    <td style="width: 49%; background-color: #E6FFFC; border-radius: 8px; padding: 10px">
                      <div style="font-weight: 600;">Delivery Schedule</div>
                      <div style="margin-top: 8px; margin-bottom: 8px; font-weight: 500;">Date : ${params.deliveryDate}</div>
                      <div style="font-weight: 500">Time : ${params.deliveryTimeStart} - ${params.deliveryTimeEnd}</div>
                    </td>
                  </tr>
                </table>
              </div>
              <div style="font-weight: 400; margin-top: 20px; color: #283238;">Please ensure that our logistics team is prepared to handle this order efficiently.</div>
              <div style="font-weight: 400; margin-top: 20px; color: #283238;">Thank You</div>
            </div>
          </div>
        </body>
      </html>
    `
  },
  postSuccessUpdateTripSchedule: (params) => {
    return `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>replit</title>
        <link href="style.css" rel="stylesheet" type="text/css" />
        <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            width: 100%;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            background: white;
          }
    
          .container {
            width: 100%;
            min-height: 100%;
            height: max-content;
            max-width: 480px;
            position: relative;
            font-size: 10px;
          }
    
          #customers {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
    
          #customers td {
            font-weight: 400;
          }
    
          #customers td, #customers th {
            padding: 8px;
          }
    
          #customers tr:nth-child(even){background-color: white;}
    
          #customers tr:hover {background-color: #ddd;}
    
          #customers th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #F0F4F4;
            color: black;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div style="margin-bottom: 10px;">
            <img src="https://storage.googleapis.com/dailypos/thecare_Logo.png" style="display: block; margin-left: auto; margin-right: auto; width: auto; height: 95px;">
          </div>
          <div style="margin-bottom: 10px; height: 2px; width: 100%; background-color: #03B5A3;"></div>
    
          <div style="padding: 16px;">
            <div style="font-weight: 500; margin-bottom: 10px;">Dear The Care Team,</div>
            <div style="font-weight: 400; margin-bottom: 20px; color: #283238;">We have received a request from a customer to reschedule their pickup and delivery details. Kindly note the updated information below:</div>
            <div style="font-weight: 600; margin-bottom: 5px;">Order ID ${params.transaction_id}</div>
    
            <div style="margin-bottom: 20px; display: flex; gap: 60px;">
              <div style="font-weight: 400; margin-right: 20px;">
                <div style="margin-bottom: 5px;">Customer Name</div>
                <div style="margin-bottom: 5px;">Customer Phone</div>
                <div style="margin-bottom: 5px;">Customer Address</div>
                <div style="margin-bottom: 5px;">Outlet</div>
              </div>
              <div style="font-weight: 400;">
                <div style="margin-bottom: 5px;">: &nbsp;&nbsp; ${params.customer_name}</div>
                <div style="margin-bottom: 5px;">: &nbsp;&nbsp; ${params.customer_phone}</div>
                <div style="margin-bottom: 5px;">: &nbsp;&nbsp; ${params.customer_address}</div>
                <div style="margin-bottom: 5px;">: &nbsp;&nbsp; ${params.outlet_name}</div>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="margin-bottom: 5px;">Previous schedule :</div>
              <div style="margin-bottom: 5px;">- Pickup Date : <span style="font-weight: 600;">${params.previousPickupDate}, ${params.previousPickupTimeStart}-${params.previousPickupTimeEnd}</span></div>
              <div style="margin-bottom: 5px;">- Delivery Date : <span style="font-weight: 600;">${params.previousDeliveryDate}, ${params.previousDeliveryTimeStart}-${params.previousDeliveryTimeEnd}</span></div>
            </div>
    
            <div>
              <table cellpadding="5" cellspacing="0" border="0" style="width: 100%; height: 70px;">
                <tr>
                  <td style="width: 49%; background-color: #E6FFFC; border-radius: 8px; padding: 10px;">
                    <div style="font-weight: 600;">Pickup Schedule</div>
                    <div style="margin-top: 8px; margin-bottom: 8px; font-weight: 500;">Date : ${params.pickupDate}</div>
                    <div style="font-weight: 500">Time : ${params.pickupTimeStart} - ${params.pickupTimeEnd}</div>
                  </td>
                  <td style="width: 2%; background-color: white;">
                  </td>
                  <td style="width: 49%; background-color: #E6FFFC; border-radius: 8px; padding: 10px">
                    <div style="font-weight: 600;">Delivery Schedule</div>
                    <div style="margin-top: 8px; margin-bottom: 8px; font-weight: 500;">Date : ${params.deliveryDate}</div>
                    <div style="font-weight: 500">Time : ${params.deliveryTimeStart} - ${params.deliveryTimeEnd}</div>
                  </td>
                </tr>
              </table>
            </div>
            <div style="font-weight: 400; margin-top: 20px; color: #283238;">Please ensure that our logistics team is prepared to handle this order efficiently.</div>
            <div style="font-weight: 400; margin-top: 20px; color: #283238;">Thank You</div>
          </div>
        </div>
      </body>
    </html>
    `
  },
};
