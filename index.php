<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COVID-19 CASES</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <?php
        $url = "https://coronavirus-ph-api.now.sh/cases";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
        $result = curl_exec($ch);
        $result = json_decode($result, true);
        curl_close($ch);

        $total = count($result);
        $totalMale = 0;
        $totalFemale = 0;
        for ($i=0; $i < $total; $i++) {             
            if ($result[$i]['gender'] == 'Male') {
                $totalMale++;
            } else {
                $totalFemale++;
            }
        }
    ?>
    <header>
        <p><strong>Total PH Covid Cases: <?php echo $total; ?></strong><p>
        <p>Male: <?php echo $totalMale; ?></p>
        <p>Female: <?php echo $totalFemale; ?></p>
    </header>
    <section class="covid-container">
    <?php  
        foreach ($result as $case) {
            ?>
            <div class="covid-cards">
                <strong>Case #<?php echo $case['case_no']; ?></strong><br><br>
                <p><strong>Date:</strong> <?php echo $case['date']; ?></p>
                <p><strong>Age:</strong> <?php echo $case['age']; ?></p>
                <p><strong>Gender:</strong> <?php echo $case['gender']; ?></p>
                <p><strong>Nationality:</strong> <?php echo $case['nationality']; ?></p>
                <p><strong>Hospital Admitted To:</strong> <?php echo $case['hospital_admitted_to']; ?></p>
                <p><strong>Travel History Abroad:</strong> <?php echo $case['had_recent_travel_history_abroad']; ?></p>
                <p class="<?php echo ($case['status'] == 'Recovered') ? 'text-green' : (($case['status'] == 'Admitted') ? 'text-orange' : 'text-red') ?> large"><strong>Status:</strong> <?php echo $case['status']; ?></p>
                <p class="covid-note"><strong>Notes:</strong> <?php echo $case['notes']; ?></p>
            </div>
        <?php
        }
    ?>
    </section>

<script src="script.js"></script>
</body>
</html>