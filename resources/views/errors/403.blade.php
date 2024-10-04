<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 Forbidden</title>
    <style>
        body {
            height: 100vh;
            margin: 0;
            background-color: #111111; /* dark grey */
            font-family: "Roboto Condensed", sans-serif;
            text-transform: uppercase;
            overflow: hidden;  
        }

        .police-tape {
            background-color: #e2bb2d; /* yellow */
            background: linear-gradient(180deg, rgba(226, 187, 45, 0.8) 0%, #e2bb2d 5%, #e2bb2d 90%, rgba(226, 187, 45, 0.6) 95%, rgba(226, 187, 45, 0.5) 100%);
            padding: 0.125em;
            font-size: 3em;
            text-align: center;
            white-space: nowrap;
            color: black; /* Set text color to black */
            overflow: hidden;
        }

        .police-tape--1 {
            transform: rotate(10deg);
            position: absolute;
            top: 40%;
            left: -5%;
            right: -5%;
            z-index: 2;
        }

        .police-tape--2 {
            transform: rotate(-8deg);
            position: absolute;
            top: 50%;
            left: -5%;
            right: -5%;
        }

        .ghost {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        .ghost--navbar {
            flex: 0 0 60px;
            background: linear-gradient(0deg, #27292d 0px, #27292d 10px, transparent 10px);
            border-bottom: 2px solid #111111;
        }

        .ghost--columns {
            display: flex;
            flex-grow: 1;
            flex-wrap: wrap; /* Allow columns to wrap */
        }

        .ghost--column {
            flex: 1 0 30%;
            border-left: 10px solid #27292d;
            background-color: #1c1f23; /* darkened lighter grey */
            box-sizing: border-box;
        }

        .ghost--main {
            background-color: #111111;
            border-top: 15px solid rgba(39, 41, 45, 0.5);
            flex: 1 0 100px;
        }

        .code {
            display: block;
            background-color: #27292d;
            height: 1em;
            margin: 1em;
        }

        .ghost--main .code {
            height: 2em;
            width: 200px;
        }

        h1, h3 {
            color: #e2bb2d; /* yellow */
            text-align: center;
            margin: 0;
        }
        
        p {
            color: white;
            text-align: center;
        }

        /* Media queries for responsiveness */
        @media (max-width: 768px) {
            .police-tape {
                font-size: 2em; /* Decrease font size for mobile */
            }

            .ghost--column {
                flex: 1 0 100%; /* Full width for columns */
                border-left: none; /* Remove left border */
                margin-bottom: 1em; /* Add some space between columns */
            }

            .ghost--main .code {
                width: 100%; /* Make code blocks full width */
            }
        }

        @media (max-width: 480px) {
            .police-tape {
                font-size: 1.5em; /* Further decrease font size for smaller screens */
            }
        }
    </style>
</head>
<body>
    <div class="ghost">
        <div class="ghost--navbar"></div>
        <div class="ghost--columns">
            <div class="ghost--column">
                <div class="code"></div>
                <div class="code"></div>
                <div class="code"></div>
                <div class="code"></div>
            </div>
            <div class="ghost--column">
                <div class="code"></div>
                <div class="code"></div>
                <div class="code"></div>
                <div class="code"></div>
            </div>
            <div class="ghost--column">
                <div class="code"></div>
                <div class="code"></div>
                <div class="code"></div>
                <div class="code"></div>
            </div>
        </div>
        <div class="ghost--main">
            <div class="code"></div>
            <div class="code"></div>
        </div>
    </div>

    <h1 class="police-tape police-tape--1">
        &nbsp;&nbsp;&nbsp;&nbsp;Error: 403&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error: 403&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error: 403&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error: 403
    </h1>
    <h1 class="police-tape police-tape--2">
        Forbidden&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forbidden&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forbidden&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forbidden&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forbidden
    </h1>
</body>
</html>
