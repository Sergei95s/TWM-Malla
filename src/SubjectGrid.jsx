import React, { useState, useEffect } from 'react';
import { Container, Paper, Text, Title, Group } from '@mantine/core';
import subjectsData from './subjects.json';

function SubjectGrid() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  useEffect(() => {
    setSubjects(subjectsData.subjects);
  }, []);

  ///materias por semestre
  const subjectsBySemester = subjects.reduce((acc, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = [];
    }
    acc[subject.semester].push(subject);
    return acc;
  }, {});

  ///mmaterias de requisito
  const getRequisites = (subjectId) => {
    return subjects.filter((subject) => subject.next.includes(subjectId));
  };

  ///materias desbloqueadas
  const getUnlocks = (subjectId) => {
    return subjects.filter((subject) => subject.prev.includes(subjectId));
  };

  ////seleccion y deseleccion de una materia
  const handleSubjectClick = (subjectId) => {
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null);
    } else {
      setSelectedSubjectId(subjectId);
    }
  };

  ///color del botón
  const getButtonStyles = (subjectId) => {    

    const isSelected = subjectId === selectedSubjectId;
    const isRequisite = getRequisites(subjectId).some(
      (requisite) => requisite.name === selectedSubjectId
    );

    const isUnlock = getUnlocks(subjectId).some(
      (unlock) => unlock.name === selectedSubjectId
    );

    let backgroundColor = 'white';
    let textColor = 'black'; 

    if (isSelected) {
      backgroundColor = 'gray';
      textColor = 'black';
    }

    if (isRequisite) {
      backgroundColor = 'green';
      textColor = 'white';
    }

    if (isUnlock) {
      backgroundColor = 'orange';
      textColor = 'black';
    }

    return { backgroundColor, color: textColor };
  };



  return (

    <Container style={{ marginTop: '20px' }}>

           <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          gap: '10px', 
        }}

      >
        {Object.keys(subjectsBySemester).map((semester) => {
          const semesterNumber = parseInt(semester, 10);
          const semesterSubjects = subjectsBySemester[semesterNumber];

          return (

            <div
              key={semester}
              style={{
                flex: '0 0 200px', 
                minWidth: '200px', 
                marginBottom: '5px', 
                display: 'flex',
                flexDirection: 'column', 
              }}

            >
              <Paper padding="xs" style={{ textAlign: 'center' }}>
                <Title order={3}>{semesterNumber}° Semestre</Title>
                <Group direction="column" spacing="xs" position="center">
                  {semesterSubjects.map((subject) => {
                    const { backgroundColor, color } = getButtonStyles(subject.name);

                    return (
                      <Paper
                        key={subject.name}
                        padding="xs"
                        style={{
                          backgroundColor,
                          color,
                          cursor: 'pointer',
                          textAlign: 'center',
                          marginBottom: '8px',
                          width: '100%',
                          maxWidth: '220px',
                          display: 'block',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                        }}
                        onClick={() => handleSubjectClick(subject.name)}
                      >
                        <Text weight={500} size="sm">{subject.name}</Text>
                      </Paper>

                    );

                  })}

                </Group>

              </Paper>

            </div>

          );

        })}

      </div>

    </Container>

  );

}

export default SubjectGrid;
