const calculateGrades = (sessional, put, final) => {
  const total = sessional + put + final;

  let grade, gradePoint;

  if (total >= 90) {
    grade = 'A+';
    gradePoint = 4.0;
  } else if (total >= 85) {
    grade = 'A';
    gradePoint = 4.0;
  } else if (total >= 80) {
    grade = 'B+';
    gradePoint = 3.5;
  } else if (total >= 75) {
    grade = 'B';
    gradePoint = 3.0;
  } else if (total >= 70) {
    grade = 'C+';
    gradePoint = 2.5;
  } else if (total >= 65) {
    grade = 'C';
    gradePoint = 2.0;
  } else if (total >= 60) {
    grade = 'D+';
    gradePoint = 1.5;
  } else if (total >= 55) {
    grade = 'D';
    gradePoint = 1.0;
  } else {
    grade = 'F';
    gradePoint = 0.0;
  }

  return { total, grade, gradePoint };
};

export default calculateGrades;
