export const lessonNumToTime = (lessonNum) => {
    switch (lessonNum) {
        case 0:
            return ['9:00', '10:30'];
        case 1:
            return ['10:40', '12:10'];
        case 2:
            return ['13:10', '14:40'];
        case 3:
            return ['14:50', '16:20'];
        case 4:
            return ['16:30', '18:00'];
        case 5:
            return ['18:10', '19:40'];
        default:
            return ['Err', 'Err'];
    }
}