package controllers

import (
	"bytes"
	"fmt"
	"github.com/gocraft/web"
	"github.com/jordan-wright/email"
	"html/template"
	"net/http"
	"net/smtp"
	"os"
)

// UAAContext stores the session info and access token per user.
// All routes within UAAContext represent the routes to the UAA service.
type UAAContext struct {
	*SecureContext // Required.
}

// uaaProxy prepares the final URL to pass through the proxy.
func (c *UAAContext) uaaProxy(rw web.ResponseWriter, req *web.Request, uaaEndpoint string) {
	reqURL := fmt.Sprintf("%s%s", c.Settings.UaaURL, uaaEndpoint)
	c.Proxy(rw, req.Request, reqURL, c.GenericResponseHandler)
}

// UserInfo returns the UAA_API/userinfo information for the logged in user.
func (c *UAAContext) UserInfo(rw web.ResponseWriter, req *web.Request) {
	c.uaaProxy(rw, req, "/userinfo")
}

// SendInvite sends users an email with a link to the UAA invite
func (c *UAAContext) SendInvite(rw web.ResponseWriter, req *web.Request) {
	var InviteUrl string
	EmailAddress := req.URL.Query().Get("email")
	InviteUrl = req.URL.Query().Get("InviteUrl")
	e := email.NewEmail()
	e.From = "cloud.gov <no-reply@cloud.gov>"
	e.To = []string{" <" + EmailAddress + ">"}
	e.Subject = "Invitation to join cloud.gov"
	t, err := template.New("inviteEmail").Parse(inviteEmailTpl)
	tb, err := template.New("inviteEmail").Parse(inviteTextTpl)
	if err != nil {
		fmt.Println("1")
		fmt.Println(err)
	}
	inviteEmailData := InviteEmail{
		Url: InviteUrl,
	}
	emailText := new(bytes.Buffer)
	emailHTML := new(bytes.Buffer)
	err = t.Execute(emailHTML, inviteEmailData)
	if err != nil {
		fmt.Println("2")
		fmt.Println(err)
	}
	err = tb.Execute(emailText, inviteEmailData)
	if err != nil {
		fmt.Println("3")
		fmt.Println(err)
	}
	e.Text = emailText.Bytes()
	e.HTML = emailHTML.Bytes()
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")
	err = e.Send(smtpHost+":"+smtpPort, smtp.PlainAuth("", smtpUser, smtpPass, smtpHost))
	if err != nil {
		fmt.Println(err)
	}
	rw.Write([]byte("{\"status\": \"success\", \"email\": " + EmailAddress + ", \"invite\": " + InviteUrl + " }"))
}

// UaaInfo returns the UAA_API/Users/:id information for the logged in user.
func (c *UAAContext) UaaInfo(rw web.ResponseWriter, req *web.Request) {
	guid := req.URL.Query().Get("uaa_guid")
	if len(guid) > 0 {
		reqURL := fmt.Sprintf("%s%s", "/Users/", guid)
		c.uaaProxy(rw, req, reqURL)
	} else {
		rw.WriteHeader(http.StatusBadRequest)
		rw.Write([]byte("{\"status\": \"Bad request\", \"error_description\": \"Missing valid guid.\"}"))
	}
}

type InviteEmail struct {
	URL string
}

const inviteTextTpl = `
You have been invited to join cloud.gov!
Claim your account below.
cloud.gov is a service by 18F that helps federal teams create and deliver quality digital services securely hosted in the cloud.

Accept the invitation - Accept your invite to continue the registration process. You can also copy the URL below and paste it into your browser's address bar:
{{.URL}}

Accept your invitation
Read the documentation - After you register and log in, review the acceptable uses and rules of behavior.

Then set up your cloud.gov access and get started.

If you run into problems or have any questions, please email us at cloud-gov-support@gsa.gov.
Thank you,
The cloud.gov team
`

const inviteEmailTpl = `
<html><head><base target="_top">
    <title>cloud.gov</title>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
    <meta content="width=device-width" name="viewport">

    <style>
      @media only screen and (max-width: 600px) {
        table[class="body"] .right-text-pad {
          padding-left: 10px!important;
        }
        table[class="body"] .left-text-pad {
          padding-right: 10px!important;
        }
        table.six-button {
          width: auto;
          min-width: auto;
        }
        .contain-attributes .panel {
          padding-left: 10px!important;
          padding-right: 10px!important;
        }
        table[class="body"] img {
          width: auto!important;
          height: auto!important;
        }
        table[class="body"] center {
          min-width: 0!important;
        }
        table[class="body"] .container {
          width: 95%!important;
        }
        table[class="body"] .row {
          width: 100%!important;
          display: block!important;
        }
        table[class="body"] .wrapper {
          display: block!important;
          padding-right: 0!important;
        }
        table[class="body"] .columns,
        table[class="body"] .column {
          table-layout: fixed!important;
          float: none!important;
          width: 100%!important;
          padding-right: 0px!important;
          padding-left: 0px!important;
          display: block!important;
        }
        table[class="body"] .wrapper.first .columns,
        table[class="body"] .wrapper.first .column {
          display: table!important;
        }
        table[class="body"] table.columns td,
        table[class="body"] table.column td {
          width: 100%!important;
        }
        table[class="body"] .columns td.one,
        table[class="body"] .column td.one {
          width: 8.333333%!important;
        }
        table[class="body"] .columns td.two,
        table[class="body"] .column td.two {
          width: 16.666666%!important;
        }
        table[class="body"] .columns td.three,
        table[class="body"] .column td.three {
          width: 25%!important;
        }
        table[class="body"] .columns td.four,
        table[class="body"] .column td.four {
          width: 33.333333%!important;
        }
        table[class="body"] .columns td.five,
        table[class="body"] .column td.five {
          width: 41.666666%!important;
        }
        table[class="body"] .columns td.six,
        table[class="body"] .column td.six {
          width: 50%!important;
        }
        table[class="body"] .columns td.seven,
        table[class="body"] .column td.seven {
          width: 58.333333%!important;
        }
        table[class="body"] .columns td.eight,
        table[class="body"] .column td.eight {
          width: 66.666666%!important;
        }
        table[class="body"] .columns td.nine,
        table[class="body"] .column td.nine {
          width: 75%!important;
        }
        table[class="body"] .columns td.ten,
        table[class="body"] .column td.ten {
          width: 83.333333%!important;
        }
        table[class="body"] .columns td.eleven,
        table[class="body"] .column td.eleven {
          width: 91.666666%!important;
        }
        table[class="body"] .columns td.twelve,
        table[class="body"] .column td.twelve {
          width: 100%!important;
        }
        table[class="body"] td.offset-by-one,
        table[class="body"] td.offset-by-two,
        table[class="body"] td.offset-by-three,
        table[class="body"] td.offset-by-four,
        table[class="body"] td.offset-by-five,
        table[class="body"] td.offset-by-six,
        table[class="body"] td.offset-by-seven,
        table[class="body"] td.offset-by-eight,
        table[class="body"] td.offset-by-nine,
        table[class="body"] td.offset-by-ten,
        table[class="body"] td.offset-by-eleven {
          padding-left: 0!important;
        }
        table[class="body"] table.columns td.expander {
          width: 1px!important;
        }
        table[class="body"] .right-text-pad,
        table[class="body"] .text-pad-right {
          padding-left: 10px!important;
        }
        table[class="body"] .left-text-pad,
        table[class="body"] .text-pad-left {
          padding-right: 10px!important;
        }
        table[class="body"] .hide-for-small,
        table[class="body"] .show-for-desktop {
          display: none!important;
        }
        table[class="body"] .show-for-small,
        table[class="body"] .hide-for-desktop {
          display: inherit!important;
        }
      }

      @media only screen and (max-width: 600px) {
        table[class="body"] .right-text-pad {
          padding-left: 10px!important;
        }
        table[class="body"] .left-text-pad {
          padding-right: 10px!important;
        }
      }
    </style>
  <style>.panel table.button:hover td{color:white !important}
a:hover{color:#2795b6 !important}
a:active{color:#2795b6 !important}
a:visited{color:#0744a4 !important}
h1 a:active{color:#2ba6cb !important}
h2 a:active{color:#2ba6cb !important}
h3 a:active{color:#2ba6cb !important}
h4 a:active{color:#2ba6cb !important}
h5 a:active{color:#2ba6cb !important}
h6 a:active{color:#2ba6cb !important}
h1 a:visited{color:#2ba6cb !important}
h2 a:visited{color:#2ba6cb !important}
h3 a:visited{color:#2ba6cb !important}
h4 a:visited{color:#2ba6cb !important}
h5 a:visited{color:#2ba6cb !important}
h6 a:visited{color:#2ba6cb !important}
div.button-div.primary:hover{display:block;width:auto !important;text-align:left;background:#ddd !important;border:2px solid #0744a4;color:#0744a4 !important;border-radius:500px;-moz-border-radius:500px;-webkit-border-radius:500px;padding:8px 0}
div.button-div.primary:hover a{font-weight:normal;text-decoration:none;font-family:Helvetica, Arial, sans-serif;color:#0744a4 !important;font-size:19px;display:block}
table.button:hover td{background:#0744a4 !important}
table.button:visited td{background:#0744a4 !important}
table.button:active td{background:#0744a4 !important}
div.button-div:hover{background:#0744a4 !important}
div.button-div:active{background:#0744a4 !important}
table.button:hover td a{color:#fff !important}
table.button:visited td a{color:#fff !important}
table.button:active td a div.button-div:hover a{color:#fff !important}
div.button-div:active a{color:#fff !important}
table.button:hover td{background:#0744a4 !important}
table.tiny-button:hover td{background:#0744a4 !important}
table.small-button:hover td{background:#0744a4 !important}
table.medium-button:hover td{background:#0744a4 !important}
div.button-div:hover{background:#0744a4 !important}
table.large-button:hover td{background:#0744a4 !important}
table.button:hover td a{color:#ffffff !important}
table.button:active td a{color:#ffffff !important}
table.button td a:visited{color:#ffffff !important}
table.tiny-button:hover td a{color:#ffffff !important}
table.tiny-button:active td a{color:#ffffff !important}
table.tiny-button td a:visited{color:#ffffff !important}
table.small-button:hover td a{color:#ffffff !important}
table.small-button:active td a{color:#ffffff !important}
table.small-button td a:visited{color:#ffffff !important}
table.medium-button:hover td a{color:#ffffff !important}
table.medium-button:active td a{color:#ffffff !important}
table.medium-button td a:visited{color:#ffffff !important}
table.large-button:hover td a{color:#ffffff !important}
table.large-button:active td a{color:#ffffff !important}
table.large-button td a:visited{color:#ffffff !important}
div.button-div:hover a{color:#ffffff !important}
div.button-div:active a{color:#ffffff !important}
table.secondary:hover td{background:#d0d0d0 !important;color:#555}
table.secondary:hover td a{color:#555 !important}
table.secondary td a:visited{color:#555 !important}
table.secondary:active td a{color:#555 !important}
table.success:hover td{background:#457a1a !important}
table.alert:hover td{background:#970b0e !important}
table.facebook:hover td{background:#2d4473 !important}
table.twitter:hover td{background:#0087bb !important}
table.google-plus:hover td{background:#CC0000 !important}
table.facebook:hover td{background:#2d4473 !important}
table.twitter:hover td{background:#0087bb !important}
table.google-plus:hover td{background:#CC0000 !important}</style></head>
  <body style="min-width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;width:100% !important">
    <table class="body" style="border-spacing:0;border-collapse:collapse;vertical-align:top;height:100%;width:100%;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px">
      <tbody><tr style="padding:0;vertical-align:top;text-align:left">
        <td align="center" class="center" valign="top" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;text-align:left;border-collapse:collapse !important">
          <center style="width:100%;min-width:580px">
            <!-- Start Header -->
            <table bgcolor="#0744a4" class="row header" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;padding:0px;width:100%;position:relative;background-color:#0744a4 !important">
              <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                <td align="center" class="center" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;text-align:left;border-collapse:collapse !important">
                  <center style="width:100%;min-width:580px">
                    <table class="container" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;width:580px;margin:0 auto;text-align:inherit">
                      <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                        <td class="wrapper last" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:10px 20px 0px 0px;position:relative;padding-right:0px;border-collapse:collapse !important"></td>
                        <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;border-collapse:collapse !important;padding:0 !important"></td>
                      </tr>
                    </tbody></table>
                  </center>
                </td>
              </tr>
            </tbody></table>
            <table class="row" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;padding:0px;width:100%;position:relative">
              <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                <td align="center" class="center" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;text-align:left;border-collapse:collapse !important">
                  <center style="width:100%;min-width:580px">
                    <table class="container" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;width:580px;margin:0 auto;text-align:inherit">
                      <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                        <td class="wrapper last" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:10px 20px 0px 0px;position:relative;padding-right:0px;border-collapse:collapse !important">
                          <table class="twelve columns" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin:0 auto;width:580px">
                            <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                              <td align="center" valign="top" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:0px 0px 10px;border-collapse:collapse !important">
                                <center style="width:100%;min-width:580px">
                                  <img class="no-float-image" src="https://dka575ofm4ao0.cloudfront.net/pages-transactional_logos/retina/15323/YxrN0Xt0Tlufw60vbCPg" style="outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;width:auto;max-width:170px;float:left;clear:both;display:block;float:none;margin:10px auto 0">
                                </center>
                              </td>
                              <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;padding:0px 0px 10px;border-collapse:collapse !important;padding:0 !important"></td>
                            </tr>
                          </tbody></table>
                        </td>
                      </tr>
                    </tbody></table>
                  </center>
                </td>
              </tr>
            </tbody></table>
            <table class="container" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;width:580px;margin:0 auto;text-align:inherit">
              <tbody><tr class="" style="padding:0;vertical-align:top;text-align:left">
                <td style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;border-collapse:collapse !important">
                  <table class="centered" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin-left:auto;margin-right:auto">
                    <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                      <td class="wrapper last row" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:10px 20px 0px 0px;position:relative;padding-right:0px;border-collapse:collapse !important">
                        <table class="twelve columns" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin:0 auto;width:580px">
                          <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                            <td style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:center;line-height:1.3;font-size:16px;line-height:20px;padding:0px 0px 10px;border-collapse:collapse !important">
                              <h3 class="text-center color-light" style="color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:center;line-height:1.3;word-break:normal;font-size:28px;text-align:center;margin-top: 20px;margin-bottom:0px;">
                                <span class="name-color" style="font-weight:bold;color:#333 !important">You have been invited to join cloud.gov!</span>
                              </h3>
                            </td>
                            <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;padding:0px 0px 10px;border-collapse:collapse !important;padding:0 !important"></td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
              <tr style="padding:0;vertical-align:top;text-align:left">
                <td style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;border-collapse:collapse !important">
                  <table class="row center" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;padding:0px;width:100%;position:relative;text-align:center;display:block">
                    <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                      <td align="center" class="wrapper last center" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:10px 20px 0px 0px;position:relative;text-align:center;padding-right:0px;border-collapse:collapse !important">
                        <center style="width:100%;min-width:580px">
                          <table class="six-button columns" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin:0 auto;width:auto;min-width:280px">
                            <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                              <td align="center" class="center" valign="top" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;text-align:center;padding:0px 0px 10px;border-collapse:collapse !important">
                                <div class="button-div" style="display:block;text-align:center;border:2px solid #0744a4;border-radius:500px;-moz-border-radius:500px;-webkit-border-radius:500px;padding:8px 20px;width:auto !important;background:#fff !important;color:#0744a4 !important">
                                  <a target="_blank" href="{{.URL}}" style="color:#2ba6cb;font-weight:normal;text-decoration:none;font-family:Helvetica, Arial, sans-serif;font-size:19px;display:block;color:#0744a4 !important">Accept your invitation
                                  </a>
                                </div>
                              </td>
                              <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;padding:0px 0px 10px;border-collapse:collapse !important;padding:0 !important"></td>
                            </tr>
                          </tbody></table>
                        </center>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
              <tr class="" style="padding:0;vertical-align:top;text-align:left">
                <td style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;border-collapse:collapse !important">
                  <table class="row" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;padding:0px;width:100%;position:relative;display:block">
                    <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                      <td class="last padding-10 wrapper" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:10px;padding:10px 20px 0px 0px;position:relative;padding-right:0px;border-collapse:collapse !important">
                        <table class="twelve columns" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin:0 auto;width:580px">
                          <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                            <td align="center" class="center no-bottom-padding" valign="top" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;text-align:left;padding:0px 0px 10px;border-collapse:collapse !important;padding-bottom:0px !important">
                              <center style="width:100%;min-width:580px">
                                <p class="paragraph-font-style " style="margin:0 0 0 10px;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;margin-bottom:0px;margin-top:20px;margin-bottom:0px;font-size:18px;color:#555;max-width:80%;text-align:left;line-height:1.3em">
                                  cloud.gov is a service by 18F that helps federal teams create and deliver quality digital services securely hosted in the cloud.
                                </p>
                              </center>
                            </td>
                            <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;padding:0px 0px 10px;border-collapse:collapse !important;padding:0 !important"></td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
              <tr class="" style="padding:0;vertical-align:top;text-align:left">
                <td style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;border-collapse:collapse !important">
                  <table class="row" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;padding:0px;width:100%;position:relative;display:block">
                    <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                      <td class="last padding-10 wrapper" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:10px;padding:10px 20px 0px 0px;position:relative;padding-right:0px;border-collapse:collapse !important">
                        <table class="twelve columns" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin:0 auto;width:580px">
                          <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                            <td align="center" class="center no-bottom-padding" valign="top" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;text-align:left;padding:0px 0px 10px;border-collapse:collapse !important;padding-bottom:0px !important">
                              <center style="width:100%;min-width:580px">
                                <p class="paragraph-font-style " style="margin:0 0 0 10px;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;margin-bottom:10px;margin-top:20px;margin-bottom:0px;font-size:18px;color:#555;max-width:80%;text-align:left;line-height:1.3em">
                                  <b>Accept the invitation</b> - <a href="{{.URL}}">Accept your invite</a> to continue the registration process. You can also copy the URL below and paste it into your browser's address bar:
																	<br>
																	{{.URL}}
                                </p>
                              </center>
                            </td>
                            <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;padding:0px 0px 10px;border-collapse:collapse !important;padding:0 !important"></td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
              <tr class="" style="padding:0;vertical-align:top;text-align:left">
                <td style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;border-collapse:collapse !important">
                  <table class="row" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;padding:0px;width:100%;position:relative;display:block">
                    <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                      <td class="last padding-10 wrapper" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:10px;padding:10px 20px 0px 0px;position:relative;padding-right:0px;border-collapse:collapse !important">
                        <table class="twelve columns" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin:0 auto;width:580px">
                          <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                            <td align="center" class="center no-bottom-padding" valign="top" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;text-align:left;padding:0px 0px 10px;border-collapse:collapse !important;padding-bottom:0px !important">
                              <center style="width:100%;min-width:580px">
                                <p class="paragraph-font-style " style="margin:0 0 0 10px;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;margin-bottom:10px;margin-top:20px;margin-bottom:20px;font-size:18px;color:#555;max-width:80%;text-align:left;line-height:1.3em">
                                  <b>Read the documentation</b> - After you register and log in, review the <a href="https://cloud.gov/docs/getting-started/accounts/#use-your-account-responsibly">acceptable uses and rules of behavior</a>.
                                </p>
                                <p class="paragraph-font-style " style="margin:0 0 0 10px;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;margin-bottom:10px;margin-top:20px;margin-bottom:20px;font-size:18px;color:#555;max-width:80%;text-align:left;line-height:1.3em">
                                  Then <a href="https://cloud.gov/docs/getting-started/setup/">set up your cloud.gov access and get started</a>.
                                </p>
                              </center>
                            </td>
                            <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;padding:0px 0px 10px;border-collapse:collapse !important;padding:0 !important"></td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
              <hr />
              <tr class="" style="padding:0;vertical-align:top;text-align:left">
                <td style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;border-collapse:collapse !important">
                  <table class="row" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;padding:0px;width:100%;position:relative;display:block">
                    <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                      <td class="last padding-10 wrapper" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:10px;padding:10px 20px 0px 0px;position:relative;padding-right:0px;border-collapse:collapse !important">
                        <table class="twelve columns" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin:0 auto;width:580px">
                          <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                            <td align="center" class="center no-bottom-padding" valign="top" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;text-align:left;padding:0px 0px 10px;border-collapse:collapse !important;padding-bottom:0px !important">
                              <center style="width:100%;min-width:580px">
                                <p class="paragraph-font-style " style="margin:0 0 0 10px;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;margin-bottom:0px;margin-top:0px;margin-bottom:0px;font-size:18px;color:#555;max-width:80%;text-align:left;line-height:1.3em">
                                  If you run into problems or have any questions, please email us at cloud-gov-support@gsa.gov.
                                </p>
                              </center>
                            </td>
                            <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;padding:0px 0px 10px;border-collapse:collapse !important;padding:0 !important"></td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
              <tr class="" style="padding:0;vertical-align:top;text-align:left">
                <td style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;border-collapse:collapse !important">
                  <table class="row" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;padding:0px;width:100%;position:relative;display:block">
                    <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                      <td class="last padding-10 wrapper" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;padding:10px;padding:10px 20px 0px 0px;position:relative;padding-right:0px;border-collapse:collapse !important">
                        <table class="twelve columns" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin:0 auto;width:580px">
                          <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                            <td align="center" class="center no-bottom-padding" valign="top" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;text-align:left;padding:0px 0px 10px;border-collapse:collapse !important;padding-bottom:0px !important">
                              <center style="width:100%;min-width:580px">
                                <p class="paragraph-font-style " style="margin:0 0 0 10px;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;margin-bottom:10px;margin-top:20px;margin-bottom:20px;font-size:18px;color:#555;max-width:80%;text-align:left;line-height:1.3em">
                                  Thank you, <br>
                                  The cloud.gov team
                                </p>
                              </center>
                            </td>
                            <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;padding:0px 0px 10px;border-collapse:collapse !important;padding:0 !important"></td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
            <hr style="color:#d9d9d9;background-color:#d9d9d9;height:1px;border:none">
            <!-- Start Container -->
            <table class="container footer-bar" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;width:580px;margin:0 auto;text-align:inherit">
              <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                <td style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;border-collapse:collapse !important">
                  <table class="row" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;padding:0px;width:100%;position:relative;display:block">
                    <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                      <td class="wrapper last" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:center;line-height:1.3;font-size:16px;line-height:20px;padding:10px 20px 0px 0px;position:relative;padding-right:0px;border-collapse:collapse !important">
                        <table class="twelve columns" style="border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;text-align:left;margin:0 auto;width:580px">
                          <tbody><tr style="padding:0;vertical-align:top;text-align:left">
                            <td align="center" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:center;line-height:1.3;font-size:16px;line-height:20px;padding:0px 0px 10px;border-collapse:collapse !important">
                              <center style="width:100%;min-width:580px">
                                <p class="text-center paragraph-link-font" style="margin:0 0 0 10px;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;margin-bottom:10px;text-align:center;margin-top:10px;font-size:18px;color:#0744a4;font-size:13px;margin-bottom:20px">
                                  Need <a href="https://cloud.gov/docs/help/" style="color:#2ba6cb;text-decoration:none;margin-top:40px;font-size:18px;color:#0744a4;text-decoration:underline;font-size:13px;margin-bottom:0px">help</a>? We'd love to hear from you.
                                </p>
                              </center>
                            </td>
                            <td class="expander" style="word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto;vertical-align:top;color:#222222;font-family:&quot;Helvetica&quot;, &quot;Arial&quot;, sans-serif;font-weight:normal;padding:0;margin:0;text-align:left;line-height:1.3;font-size:16px;line-height:20px;visibility:hidden;width:0px;padding:0px 0px 10px;border-collapse:collapse !important;padding:0 !important"></td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
          </center>
        </td>
      </tr>
    </tbody></table>
</body></html>

`
