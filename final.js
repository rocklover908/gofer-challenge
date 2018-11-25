compt = 0;
affectation = [];
queslist = [];
launchList = {};
tolerance = 40;
//initializig the structue affectation
function initialize() {
    for (i = 0; i < 50; i++) {

        affectation.push({
            masseur: i + 1,
            posactuelle: { x: 0, y: 0 },
            taches: []
        })
    }
}
//find the postion of the masseur when the mission to affect would start
function findPosition(taches, element) {
    foundpos = { x: 0, y: 0 };
    found = false
    i = 0
    taches = taches.sort(function (a, b) {
        return a.end - b.end
    });
    while (!found && i < taches.length) {
        if (i + 1 < taches.length) {
            if (element.start < taches[i].end && element.start < taches[i + 1].launch) {
                found = true
                foundpos.x = taches[i].x
                foundpos.y = taches[i].y

            } else {
                i++
            }
        } else {
            foundpos.x = taches[i].x
            foundpos.y = taches[i].y
            found = true
        }

    }
    return foundpos
}
//check if the masseur is busy for the mission
function checkIfBusy(taches, element) {
    i = 0
    booked = false
    taches = taches.sort(function (a, b) {
        return a.launch - b.launch
    });
    while (booked == false && i < taches.length) {
        distance = Math.sqrt(Math.pow((element.x - taches[i].x), 2) + Math.pow((element.y - taches[i].y), 2))
        dureeTrajet = distance / 0.25
        timeToGo = element.start - dureeTrajet
        if (element.start >= taches[i].end) {
            if (element.start >= (taches[i].launch) && element.start <= taches[i].end) {
                booked = true
            } else if ((element.start + element.length) >= (taches[i].launch) &&
                (element.start + element.length) <= taches[i].end) {
                booked = true

            } else {
                i++;
            }
        } else {
            i++;
        }

    }
    return booked
}
function attributeMissions(missions) {
    //empty the launchList
    launchList = {}
    //sort mission by ascending order of the start time
    missions = missions.sort(function (a, b) {
        return a.start - b.start
    });
    //initialize the structure affectation
    if (compt == 0) {
        initialize()

    }
    //find a masseur for each mission
    missions.forEach(function (element) {
        if (element.start > compt + 5) {

            //sort the affectation by the masseur who has the least task to do 
            affectation = affectation.sort(function (a, b) {
                return a.taches.length - b.taches.length
            });


            m = 0
            foundmasseur = false
            while (foundmasseur == false && m < affectation.length) {


                mas = affectation[m]
                taches = mas.taches
                if (taches.length > 0) {
                    booked = checkIfBusy(taches, element)
                    if (booked === false) {


                        foundpos = findPosition(taches, element)
                        //calculate the distance between the postion of the 
                        distance = Math.sqrt(Math.pow((element.x - foundpos.x), 2) + Math.pow((element.y - foundpos.y), 2))
                        // calculate the time taken to reach the mission position
                        dureeTrajet = distance / (15 * 0, 0166667)
                        // calculate the time to move
                        timeToGo = element.start - dureeTrajet

                        //add the misson to the queuelist 
                        queslist.push({ masseur: mas.masseur, launch: timeToGo, start: element.start, x: element.x, y: element.y });
                        //add the misson to the task of the chosen masseur  
                        taches.push({ launch: element.start - dureeTrajet, start: element.start, end: element.start + element.length, x: element.x, y: element.y })
                        foundmasseur = true;
                    } else {
                        m++;
                    }
                } else {
                    distance = Math.sqrt(Math.pow((element.x - mas.posactuelle.x), 2) + Math.pow((element.y - mas.posactuelle.y), 2))
                    dureeTrajet = distance / (15 * 0, 0166667)
                    timeToGo = element.start - dureeTrajet


                    queslist.push({ masseur: mas.masseur, launch: timeToGo, start: element.start, x: element.x, y: element.y });

                    taches.push({ launch: element.start - dureeTrajet, start: element.start, end: element.start + element.length, x: element.x, y: element.y })
                    foundmasseur = true;
                }



            }

           

        }

    });


    queslist.forEach((element, index, object) => {
        //check if the task time is reached and added to the launchlist
        if ((element.launch < (compt + tolerance)) && (element.launch >= compt)) {
            launchList[element.masseur] = { x: element.x, y: element.y };

            object.splice(index, 1);
        }
    });
    compt += 5;
     return launchList;
}