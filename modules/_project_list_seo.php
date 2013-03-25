<?php
    $json = file_get_contents('json/cws.json');
    $data = json_decode($json,true);
    $decodedData = $data["cwsData"]["projects"];
    $tests = array(
        'duration' => 'Project duration',
        'shortDescription' => 'Description',
        'projectDescription' => 'Project description',
        );

    foreach ($decodedData AS $key => $value) {
        echo "<h3>Project: " . htmlentities($value['projectName']) . "</h3> <p><strong>Client: " . htmlentities($value['client']) . " - Agency: " . htmlentities($value['agency']) . "</strong></p>";
        if (!empty($decodedData[$key]["extendedInfo"]["agencyDetails"])) {
            echo htmlentities($decodedData[$key]["extendedInfo"]["agencyDetails"]) . "<br/>";
        }
        if (!empty($decodedData[$key]["extendedInfo"]["workUndertaken"])) {
            echo "Tasks undertaken included: " . utf8_decode($decodedData[$key]["extendedInfo"]["workUndertaken"]) . " ";
        }
        if (!empty($decodedData[$key]["extendedInfo"]["otherDetails"])) {
            echo "Other details: ";
            foreach ($decodedData[$key]["extendedInfo"]["otherDetails"] AS $key2 => $value2) {
                echo htmlentities($value2) . ". ";
            }
        }
        echo '<ul>';
        foreach($value AS $innerKey => $innerValue) {
            if(!is_array($innerValue)) {
                foreach ($tests AS $input => $humanReadable) {
                    if($innerKey == $input) {
                        $innerKey = $humanReadable;
                        echo "<li>". htmlentities($innerKey) . ": ". htmlentities($innerValue)."</li>";
                    }
                }
            }
        }
        echo '</ul>';

        if(!empty($value["assets"]["links"])) {
            echo '<ul>';
            foreach ($value["assets"]["links"] AS $key2 => $value2) {
                echo '<li><a href="' . $value2["url"] . '">' . htmlentities($value2["title"]) . '</a></li>';
            }
            echo '</ul>';
        } 
    }
    unset($decodedData, $json, $data, $tests);
?>