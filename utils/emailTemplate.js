const emailTemplate = content => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap"
      rel="stylesheet"
    />

    <style>
      html {
        margin: 0;
        padding: 0;
      }

      body {
        font-family: "Quicksand", sans-serif;
        text-align: center;

        padding-top: 2%;
        padding-bottom: 5%;
      }

      h1 {
        color: rgba(255, 0, 92);
        font-weight: 700;
        margin-bottom: 40px;
      }

      p {
        font-weight: 515;
        color: rgb(72, 72, 72);
        max-width: 60%;
        line-height: 26px;
        letter-spacing: 1px;

        margin-left: auto;
        margin-right: auto;
        
        margin-bottom: 50px;
      }
      
      
    </style>
  </head>
  <body>
    <h1>Idea App</h1>
    <p>
      ${content}
    </p>
    <span>
      Regards, The Idea App Team
    </span>
  </body>
</html>

`;

module.exports = emailTemplate;
