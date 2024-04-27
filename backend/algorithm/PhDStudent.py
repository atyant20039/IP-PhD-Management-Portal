class PhDStudent:
    def __init__(self, admission_no, name, email):
        self.admission_no = admission_no
        self.name = name
        self.email = email
        self.enrolled_courses = []
        self.invigilation_duties = []   
        self.duties = []

    def add_invigilation_duty(self, duty):
        self.add_invigilation_duties.append(duty)

    def add_enrolled_course(self, course_code):
        self.enrolled_courses.append(course_code)

    def add_duty(self, duty):
        self.duties.append(duty)

    def get_duties(self):
        return self.duties

    def get_admission_no(self):
        return self.admission_no

    def get_name(self):
        return self.name

    def get_email(self):
        return self.email

    def get_enrolled_courses(self):
        return self.enrolled_courses
    
    def get_invigilation_duties(self):
        return self.invigilation_duties
