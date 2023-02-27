import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from "../App";
import './About.css';
import moment from "moment";
import Calendar from './Calendar';

function About() {
    const { stateToken, dispatchToken } = useContext(UserContext);

    const [showImage, setShowImage] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [toggledSubjects, setToggledSubjects] = useState([]); // stores the subject names for which the calendar needs to be shown
    const [subName, setSubName] = useState(''); // stores new subject name
    const [present, setPresent] = useState(0); //  stores new subject number of present days
    const [absent, setAbsent] = useState(0); //  stores new subject number of absent days
    const [user, setUser] = useState(''); // stores currently logged in user
    const [subjArr, setSubjArr] = useState([]); // stores currently logged in user's subjects
    const [goal, setGoal] = useState(0); // stores currently logged in user's attendance goal

    const navigate = useNavigate();


    const callAboutUsPage = async () => { // called on component did mount
        try {
            // const res = await axios.post('http://localhost:3000/about',
            const res = await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/about',
                { token: stateToken },// sends data to backend, accessed from req.body
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            const data = res.data;

            setUser(data.name)
            setSubjArr(data.subjects)
            setGoal(data.attendanceGoal)
        }
        catch (err) {
            navigate('/login');
        }
    }
    useEffect(() => {
        callAboutUsPage();
    }, []); // component did mount

    let currentYear = () => { // returns the current year
        return moment().format("Y");
    };
    let currentMonth = () => { // returns the current month
        return moment().format("M");
    };
    let currentDate = () => { // returns the current date
        return moment().format("D");
    };

    let setImage = (subjName, attendance) => {
        if (attendance >= goal + 20) // >=95%
            setImgUrl(require('../assets/won.gif'))
        else if (attendance >= goal) // >=75%
            setImgUrl(require('../assets/giphy.gif'))
        else if (attendance >= goal - 5) // >=70%
            setImgUrl(require('../assets/pic.gif'))
        else if (attendance >= goal - 10) // >=65%
            setImgUrl(require('../assets/keep-your-heads-up.gif'))
        else if (attendance >= goal - 15) // >=60%
            setImgUrl(require('../assets/youre-not-keeping-up-keep-up.gif'))
        else if (attendance >= goal - 20) // >=55%
            setImgUrl(require('../assets/try-harder-have-to-try-harder-than-that.gif'));
        else if (attendance >= goal - 35) // >=40%
            setImgUrl(require('../assets/atleast-you-tried.gif'))
        else
            setImgUrl(require('../assets/loser-lounge.gif'))

        setShowImage(subjName);
        setTimeout(() => {
            setShowImage('');
        }, 2500);

    }
    let incrementPresent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;
            let subjectPresentDates = [];
            let subjectAbsentDates = [];

            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) { // matches the subject from the array which actually needs to be changed
                    tempArr[i].present++;

                    if (!tempArr[i].presentDates.includes(`${currentDate()} ${currentMonth()} ${currentYear()}`)) // to prevent multiple entries of the same date in the database
                        tempArr[i].presentDates.push(`${currentDate()} ${currentMonth()} ${currentYear()}`) // push today's date in the database

                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;
                    subjectPresentDates = tempArr[i].presentDates;
                    subjectAbsentDates = tempArr[i].absentDates;
                }
            }
            setSubjArr(tempArr); // subject array state updated

            // await axios.post('http://localhost:3000/updateSubject', {
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent, subjectPresentDates: subjectPresentDates, subjectAbsentDates: subjectAbsentDates
            })

            let attd = (parseInt(subjPresent) * 100 / Math.max((parseInt(subjPresent) + parseInt(subjAbsent)), 1)).toFixed(2);
            setImage(subjName, attd)
        }
        catch (err) {
            console.log(err);
        }
    }

    let decrementPresent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;
            let subjectPresentDates = [];
            let subjectAbsentDates = [];

            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) { // matches the subject from the array which actually needs to be changed
                    tempArr[i].present--;
                    tempArr[i].present = Math.max(tempArr[i].present, 0); // number of days present can never be less than 0
                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;

                    subjectPresentDates = tempArr[i].presentDates.filter((date) => { return date != `${currentDate()} ${currentMonth()} ${currentYear()}` }); // current date should be removed from the presentDates array
                    tempArr[i].presentDates = subjectPresentDates;
                    subjectAbsentDates = tempArr[i].absentDates;
                }
            }
            setSubjArr(tempArr);
            // await axios.post('http://localhost:3000/updateSubject', {
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent, subjectPresentDates: subjectPresentDates, subjectAbsentDates: subjectAbsentDates
            })
            let attd = (parseInt(subjPresent) * 100 / Math.max((parseInt(subjPresent) + parseInt(subjAbsent)), 1)).toFixed(2);
            setImage(subjName, attd)
        }
        catch (err) {
            console.log(err);
        }
    }
    let incrementAbsent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;
            let subjectPresentDates = [];
            let subjectAbsentDates = [];

            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) {
                    tempArr[i].absent++;
                    if (!tempArr[i].absentDates.includes(`${currentDate()} ${currentMonth()} ${currentYear()}`)) // to prevent multiple entries of the same date in the database
                        tempArr[i].absentDates.push(`${currentDate()} ${currentMonth()} ${currentYear()}`)
                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;
                    subjectPresentDates = tempArr[i].presentDates;
                    subjectAbsentDates = tempArr[i].absentDates;
                }
            }
            setSubjArr(tempArr);
            // await axios.post('http://localhost:3000/updateSubject', {
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent, subjectPresentDates: subjectPresentDates, subjectAbsentDates: subjectAbsentDates
            })
            let attd = (parseInt(subjPresent) * 100 / Math.max((parseInt(subjPresent) + parseInt(subjAbsent)), 1)).toFixed(2);
            setImage(subjName, attd)
        } catch (err) {
            console.log(err);
        }
    }
    let decrementAbsent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;
            let subjectPresentDates = [];
            let subjectAbsentDates = [];

            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) {
                    tempArr[i].absent -= 1;
                    tempArr[i].absent = Math.max(tempArr[i].absent, 0);
                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;

                    subjectPresentDates = tempArr[i].presentDates;
                    subjectAbsentDates = tempArr[i].absentDates.filter((date) => { return date != `${currentDate()} ${currentMonth()} ${currentYear()}` });
                    tempArr[i].absentDates = subjectAbsentDates;
                }
            }
            setSubjArr(tempArr);
            // await axios.post('http://localhost:3000/updateSubject', {
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent, subjectPresentDates: subjectPresentDates, subjectAbsentDates: subjectAbsentDates
            })
            let attd = (parseInt(subjPresent) * 100 / Math.max((parseInt(subjPresent) + parseInt(subjAbsent)), 1)).toFixed(2);
            setImage(subjName, attd)
        } catch (err) {
            console.log(err);
        }
    }
    let deleteSubject = async (subjectToBeDeleted) => {

        try {
            // await axios.post('http://localhost:3000/deleteSubject', {
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/deleteSubject', {
                name: user, subjectName: subjectToBeDeleted
            })
            let tempArr = [];
            for (let i = 0; i < subjArr.length; i++) {
                if (subjArr[i].name !== subjectToBeDeleted) { // subject that is to be deleted is filtered out from the subjects array
                    tempArr.push(subjArr[i]);
                }
            }
            setSubjArr(tempArr);
        } catch (err) {
            console.log(err);
        }

    }
    let handleGoalChange = async (e) => { // changes the current attendance goal of the user
        setGoal(e.target.value)

        try {
            // await axios.post('http://localhost:3000/setGoal', {
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/setGoal', {
                name: user, newGoal: e.target.value
            })
        } catch (err) {
            console.log(err)
        }
    }
    let handleSubmit = async (e) => {
        e.preventDefault();
        if (subName === '')
            return;

        try {
            let newSubj = { name: subName.toUpperCase(), present: present, absent: absent, presentDates: [], absentDates: [] }; // creates a new subject object
            let subjs = [...subjArr, newSubj]; // inserts the new subject into the subject array 

            // await axios.post('http://localhost:3000/createSubject', {
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/createSubject', {
                name: user, subjectName: subName.toUpperCase(), pre: present, abs: absent
            })

            setSubjArr([...subjs]);
            setSubName('');
            setAbsent(0);
            setPresent(0);

            document.getElementById("input1clear").value = ""; // clear input fields after form submit
            document.getElementById("input2clear").value = ""; // clear input fields after form submit

        }
        catch (err) {
            console.log(err);
        }
    }
    let toggleCalendarDisplay = (subjectName) => {
        if (toggledSubjects.includes(subjectName)) { // if the subject already exists then we do not need to display the calendar anymore
            let tempSubjs = [...toggledSubjects]
            setToggledSubjects(tempSubjs.filter(name => { return name != subjectName }))
        }
        else { // if subject is new then we need to display the calendar for this subject
            let tempSubjs = [...toggledSubjects]
            tempSubjs.push(subjectName)
            setToggledSubjects(tempSubjs);
        }
    }
    return (
        <div className='pleasant'>
            <h4>Attendance Goal: <input className='input-field' value={(goal) ? goal : ''} placeholder={'set your goal'} onChange={(e) => handleGoalChange(e)}></input></h4>
            <form method="POST" onSubmit={(e) => handleSubmit(e)}>
                <input type="text" placeholder='New subject Name' value={subName} onChange={(e) => setSubName(e.target.value)} />
                <input type="text" id='input1clear' placeholder='Total Number of days present' onChange={(e) => setPresent(e.target.value)} />
                <input type="text" id='input2clear' placeholder='Total Number of days absent' onChange={(e) => setAbsent(e.target.value)} />
                <button >Create a new subject</button>
            </form><br />
            {
                (subjArr.length) ?
                    <h1>Subjects:</h1>
                    :
                    <></>
            }
            <h3>
                <ul>
                    {
                        subjArr.map((subj) => (
                            <>
                                <div className='subjects'>
                                    {
                                        <h4>
                                            {subj.name}:
                                            <span>Present: {subj.present}  <button type="button" className="btn btn-success" onClick={() => incrementPresent(subj.name)}>+</button><button type="button" className="btn btn-danger" onClick={() => decrementPresent(subj.name)}>-</button></span>
                                            <span>Absent: {subj.absent}  <button type="button" className="btn btn-warning" onClick={() => incrementAbsent(subj.name)}>+</button><button type="button" className="btn btn-danger" onClick={() => decrementAbsent(subj.name)}>-</button></span>
                                            <span>Attendance: {(parseInt(subj.present) * 100 / Math.max((parseInt(subj.present) + parseInt(subj.absent)), 1)).toFixed(2)}%</span><br />
                                            {showImage === subj.name && <img src={imgUrl} alt="Image" />}
                                            {
                                                (Math.ceil(Math.max((((goal * (parseInt(subj.absent) + parseInt(subj.present))) - 100 * parseInt(subj.present)) / (100 - goal)), 0))) ?
                                                    <h4>
                                                        Status: Attend next {Math.ceil(Math.max((((goal * (parseInt(subj.absent) + parseInt(subj.present))) - 100 * parseInt(subj.present)) / (100 - goal)), 0))} classes to get back to {goal}% attendance
                                                    </h4>
                                                    :
                                                    (Math.floor(Math.max(0, ((100 * parseInt(subj.present) - ((parseInt(subj.present) + parseInt(subj.absent)) * goal)) / goal)))) ?
                                                        <h4>
                                                            Status: You can miss the next {Math.floor(Math.max(0, ((100 * parseInt(subj.present) - ((parseInt(subj.present) + parseInt(subj.absent)) * goal)) / goal)))} classes and still maintain {goal}% attendance
                                                        </h4>
                                                        :
                                                        <h4>
                                                            Status: On track, you can't miss the next class
                                                        </h4>

                                            }
                                            <button type="button" className="btn btn-danger" onClick={() => deleteSubject(subj.name)}>Delete Subject</button>
                                            <button type="button" className="btn btn-warning" onClick={() => toggleCalendarDisplay(subj.name)}>Calendar</button>


                                            {toggledSubjects.includes(subj.name) && <Calendar presentDates={subj.presentDates} absentDates={subj.absentDates} />}

                                        </h4>
                                    }
                                </div>
                            </>
                        ))
                    }
                </ul>
            </h3>
        </div>
    )
}

export default About
