<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 Forbidden</title>
    <style>
       
        /* Set body and html to full height and width */
        .bg-image img {
    width: 100%;
    display:block;
    height:100%;
    object-fit:cover;
}
.error {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.lock-image img {
    width: 100%;
    height: 100%;
}
.lock-image {
    position: absolute;
    top: 33%;
    z-index: 4;
    width: 130px;
    left: 35%;
}

.error-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    z-index: 4;
    justify-content: center;
    flex-direction: column;
}

.bg-image {
    position: relative;
}

.bg-image:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #00000096;
    z-index: 4;
}
.blood-image img {
    width: 100%;
    object-fit: cover;
}

.blood-image {
    position: absolute;
    width: 100%;
    transform: rotate(102deg);
    z-index: 2;
    top: 0;
    left: -580px;
    filter: drop-shadow(2px 4px 6px black);
}
.error-content h1 {
    color: #fff;
    font-size: 120px;
    margin: 0;
}
.hand-image img {
    width: 100%;
    height: 100%;
}
.hand-image {
    position: absolute;
    top: 70px;
    z-index: 3;
    right: 20px;
}

.error-content h3 {
    margin: 0;
    color: red;
    text-transform: uppercase;
    font-size: 22px;
    letter-spacing: 6px;
    margin-top: -16px;
    font-family: cursive;
}
.error-content p {
    margin: 0;
    color: #fff;
    margin-top: 10px;
    text-transform: capitalize;
    font-family: cursive;
    font-size: 18px;
}
    
    </style>
</head>
<body>
    <div class="error">
        <div class="bg-image">
            <img src="image/venomface.png" alt="">
        </div>
        <div class="blood-image">
            <img src="image/blood.png" alt="">
        </div>
        <div class="hand-image">
            <img src="image/hand.png" alt="">
        </div>
        <div class="lock-image">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" version="1.0" viewBox="0.0 0.0 368.9 500.0" zoomAndPan="magnify" style="fill: rgb(188, 24, 35);" original_string_length="898"><g id="__id23_sgfg7gnb8l"><path d="M350.5,202.7h-25.5v-62C325.1,63.1,262,0,184.4,0S43.7,63.1,43.7,140.7v62H18.3C8.2,202.7,0,210.9,0,221v260.8 C0,491.8,8.2,500,18.3,500h332.3c10.1,0,18.3-8.2,18.3-18.3V221C368.8,210.9,360.6,202.7,350.5,202.7z M80.3,140.7 c0-57.4,46.7-104.1,104.1-104.1s104.1,46.7,104.1,104.1v62H80.3V140.7z M202.7,364.5v48.1c0,10.1-8.2,18.3-18.3,18.3 s-18.3-8.2-18.3-18.3v-48.1c-12.6-6.6-21.2-19.8-21.2-34.9c0-21.8,17.7-39.4,39.4-39.4c21.8,0,39.4,17.7,39.4,39.4 C223.9,344.7,215.3,357.9,202.7,364.5z" style="fill: inherit;"/></g></svg>
        </div>

        <div class="error-content">
            <h1>403</h1>
            <h3>Forbidden</h3>
            <p>You don’t have permission to access this resource.</p>
        </div>
    </div>
</body>
</html>
