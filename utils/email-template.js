//Email template to send the OTP

export const textVersionEmailTemplate = (otpCode) => {
  return `
  Welcome to WordleDoodle!

  To complete your account verification, please enter the OTP below:

  ${otpCode}

  This code will expire in 10 minutes. 
  Please do not share it with anyone.`;
}

export const htmlVersionEmailTemplate = (otpCode) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
       <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet">
      <title>OTP Verification</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f5f7fa; font-family:Fredoka One, cursive; font-weight:bold">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f5f7fa; padding:40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:30px;">
              
              <!-- Title -->
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <h1 style="margin:0; font-size:24px; color:#333;">
                  Welcome to <span style="color:#FFEB3B;">Wor</span><!--
                  --><span style="color:#4CAF50;">dle</span><!--
                  --><span style="color:hsl(240, 2%, 23%);">Doo</span><!--
                  --><span style="color:hsl(115, 29%, 43%);">dle</span></h1>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="font-size:16px; color:#555; padding-bottom:20px; line-height:1.5;">
                  To complete your account verification, please enter the OTP below:
                </td>
              </tr>

              <!-- OTP Box -->
              <tr>
                <td align="center" style="padding:15px 0;">
                  <div style="display:inline-block; font-size:28px; font-weight:bold; letter-spacing:8px; color:#fff; background:#4CAF50; padding:15px 25px; border-radius:2px; box-shadow:inset 0 3px 5px rgba(0,0,0,0.3), 0 3px 8px rgba(0,0,0,0.2);">
                    ${otpCode}
                  </div>
                </td>
              </tr>

              <!-- Expiry Notice -->
              <tr>
                <td style="font-size:14px; color:#999; text-align:center; padding-top:20px;">
                  This code will expire in 10 minutes. Please do not share it with anyone.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
}