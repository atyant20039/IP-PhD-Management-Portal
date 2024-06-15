import math

class Course:
    def __init__(self, course_acronym, course_code, strength, date, time, day, room_no, building, room_capacity, TARatio):
        self.course_acronym = course_acronym
        self.course_code = course_code
        self.strength = strength
        self.date = date
        self.time = time
        self.day = day
        self.room_no = room_no
        self.building = building
        self.ratio = TARatio
        self.distribution = []
        self.req_invigilators = self.__set_req_invigilators(strength, self.room_no, room_capacity)
        self.course_ta = [] 
        self.invigilators = []

    def __set_req_invigilators(self, strength, room_no, room_capacity):
        num_invigilator = 0
        num_room = len(room_no)
        for room in room_no:
            num_students = min(strength, room_capacity[room.lower()])
            result = num_students/self.ratio

            if(num_students >= 150):
                num_invigilator += math.floor(result)
                self.distribution.append(math.floor(result))
            elif (num_students >= self.ratio and num_students % self.ratio >= 10):
                num_invigilator += math.ceil(result)
                self.distribution.append(math.ceil(result))
            elif (num_students < self.ratio):
                if(num_room > 1 or num_students >= 10):
                    num_invigilator += 1
                    self.distribution.append(1)
            else:
                num_invigilator += math.floor(result)
                self.distribution.append(math.floor(result))

            strength -= num_students
        return num_invigilator
        
        
    def get_req_invigilator(self):
        return self.req_invigilators
        
    def add_invigilators(self, invigilator):
        self.invigilators.append(invigilator)

    def add_course_ta(self, course_ta):
        self.course_ta.append(course_ta)

    def get_course_acronym(self):
        return self.course_acronym

    def get_course_code(self):
        return self.course_code

    def get_section(self):
        return self.section
    
    def get_course_ta(self):
        return self.course_ta

    def get_strength(self):
        return self.strength

    def get_date(self):
        return self.date

    def get_time(self):
        return self.time
    
    def get_day(self):
        return self.day
    
    def get_room_no(self):
        return self.room_no
    
    def get_invigilators(self):
        return self.invigilators
    
    def get_building(self):
        return self.building
    
    def get_distribution(self):
        return self.distribution

    