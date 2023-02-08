import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from "../App";
import './About.css';

function About() {
    const { stateToken, dispatchToken } = useContext(UserContext);

    const [subjArr, setSubjArr] = useState([]);
    const [subName, setSubName] = useState('');
    const [present, setPresent] = useState(0);
    const [absent, setAbsent] = useState(0);
    const [user, setUser] = useState('');
    const [goal, setGoal] = useState(0);

    const navigate = useNavigate();


    const callAboutUsPage = async () => {
        try {
            const res = await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/about',
                { token: stateToken },
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });

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
    }, []);


    let incrementPresent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;
            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) {
                    tempArr[i].present++;
                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;
                }
            }
            setSubjArr(tempArr);
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent
            })
        }
        catch (err) {
            console.log(err);
        }
    }
    let decrementPresent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;
            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) {
                    tempArr[i].present--;
                    tempArr[i].present = Math.max(tempArr[i].present, 0);
                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;
                }
            }
            setSubjArr(tempArr);
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent
            })
        }
        catch (err) {
            console.log(err);
        }
    }
    let incrementAbsent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;

            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) {
                    tempArr[i].absent++;
                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;
                }
            }
            setSubjArr(tempArr);
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent
            })
        } catch (err) {
            console.log(err);
        }
    }
    let decrementAbsent = async (subjName) => {
        try {
            let subjPresent = 0;
            let subjAbsent = 0;

            let tempArr = [...subjArr];
            for (let i = 0; i < tempArr.length; i++) {
                if (tempArr[i].name === subjName) {
                    tempArr[i].absent -= 1;
                    tempArr[i].absent = Math.max(tempArr[i].absent, 0);
                    subjPresent = tempArr[i].present;
                    subjAbsent = tempArr[i].absent;
                }
            }
            setSubjArr(tempArr);
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/updateSubject', {
                name: user, subjectName: subjName, present: subjPresent, absent: subjAbsent
            })
        } catch (err) {
            console.log(err);
        }
    }
    let deleteSubject = async (subjectToBeDeleted) => {

        try {
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/deleteSubject', {
                name: user, subjectName: subjectToBeDeleted
            })
            let tempArr = [];
            for (let i = 0; i < subjArr.length; i++) {
                if (subjArr[i].name !== subjectToBeDeleted) {
                    tempArr.push(subjArr[i]);
                }
            }
            setSubjArr(tempArr);
        } catch (err) {
            console.log(err);
        }

    }
    let handleGoalChange = async (e) => {
        setGoal(e.target.value)

        try {
            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/setGoal', {
                name: user, newGoal: e.target.value
            })
        } catch (err) {
            console.log(err)
        }
    }
    let handleSubmit = async (e) => {
        e.preventDefault();
        if (subName === '') {
            return;
        }
        try {
            let newSubj = { name: subName.toUpperCase(), present: present, absent: absent };
            let subjs = [...subjArr, newSubj];

            await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/createSubject', {
                name: user, subjectName: subName.toUpperCase(), pre: present, abs: absent
            })
            setSubjArr([...subjs]);
            setSubName('');
            setAbsent(0);
            setPresent(0);
            document.getElementById("input1clear").value = "";
            document.getElementById("input2clear").value = "";

        }
        catch (err) {
            console.log(err);
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
                                            <span>Attendance: {(parseInt(subj.present) * 100 / Math.max((parseInt(subj.present) + parseInt(subj.absent)), 1)).toFixed(2)}%</span>
                                            {
                                                (Math.max((((goal * (parseInt(subj.absent) + parseInt(subj.present))) - 100 * parseInt(subj.present)) / (100 - goal)), 0)) ?
                                                    <h4>
                                                        Status: Attend next {Math.max((((goal * (parseInt(subj.absent) + parseInt(subj.present))) - 100 * parseInt(subj.present)) / (100 - goal)), 0)} classes to get back to {goal}% attendance
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
                                            <span><button type="button" className="btn btn-danger" onClick={() => deleteSubject(subj.name)}>Delete Subject</button></span>
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
