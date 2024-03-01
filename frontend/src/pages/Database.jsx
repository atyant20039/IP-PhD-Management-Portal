/*
class Student(models.Model):
    rollNumber = models.CharField(max_length=255, primary_key=True) 
    name = models.CharField(max_length=255)
    emailId = models.EmailField(max_length=255, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Others', 'Others')])
    department = models.CharField(max_length=255, choices=[('CSE', 'CSE'), ('CB', 'CB'), ('ECE', 'ECE'), ('HCD', 'HCD'), ('SSH', 'SSH'), ('MATHS', 'MATHS')])
    joiningDate = models.DateField()
    batch = models.CharField(max_length=225, help_text="Use the following format: Month YYYY", validators=[validate_batch_format])
    educationalQualification = models.CharField(max_length=255, null=True, blank=True)
    region = models.CharField(max_length=255, null=True, blank=True, choices=[('Delhi','Delhi'), ('Outside Delhi','Outside Delhi')])
    admissionThrough = models.CharField(max_length=255, choices=[('Regular','Regular'),('Rolling','Rolling'),('Sponsored','Sponsored'),('Migrated','Migrated'),('Direct','Direct')])
    fundingType = models.CharField(max_length=255, choices=[('Institute', 'Institute'), ('Sponsored', 'Sponsored'), ('Others', 'Others')])
    sourceOfFunding = models.CharField(max_length=255, null=True, blank=True)
    contingencyPoints = models.PositiveIntegerField(default=20000)
    studentStatus = models.CharField(max_length=255, default='Active', choices=[('Terminated','Terminated'), ('Graduated','Graduated'), ('Shifted','Shifted'), ('Semester Leave','Semester Leave'), ('Active','Active')])
    thesisSubmissionDate = models.DateField(blank=True, null=True)
    thesisDefenceDate = models.DateField(blank=True, null=True)
    yearOfLeaving = models.PositiveIntegerField(help_text="Use the following format: YYYY", null=True, blank=True, validators=[MinValueValidator(2000)])
    comment = models.TextField(blank=True, null=True)

    properties are:
    rollNumber, name, email, gender, department, joiningDate, batch, educationalQualification, region, admissionThrough, fundingType, sourceOfFunding, contingencyPoints, studentStatus, thesisSubmissionDate, thesisDefenceDate, yearOfLeaving, comment
*/
import {
	MagnifyingGlassIcon,
	ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
	Card,
	CardHeader,
	Input,
	Typography,
	Button,
	CardBody,
	Chip,
	CardFooter,
	Tabs,
	TabsHeader,
	Tab,
	Avatar,
	IconButton,
	Tooltip,
} from "@material-tailwind/react";
import { useState } from "react";

const TABS = [
	{
		label: "All",
		value: "all",
	},
	{
		label: "Monitored",
		value: "monitored",
	},
	{
		label: "Unmonitored",
		value: "unmonitored",
	},
];

export default function DatabasePage() {
	const TABLE_HEAD = [
		"Roll Number",
		"Name",
		"Gender",
		"Department",
		"Batch",
		"Admission Through",
		"Advisor 1",
		"Student Status",
	];

	const [data, setData] = useState([
		// 5 rows made using TABLE_HEAD properties
		{
			rollNumber: "20D17001",
			name: "Rahul",
			gender: "Male",
			department: "CSE",
			batch: "July 2020",
			admissionThrough: "Regular",
			advisor1: "Dr. XYZ",
			studentStatus: "Active",
		},
		{
			rollNumber: "20D17002",
			name: "Rohit",
			gender: "Male",
			department: "CSE",
			batch: "July 2020",
			admissionThrough: "Regular",
			advisor1: "Dr. XYZ",
			studentStatus: "Active",
		},
		{
			rollNumber: "20D17003",
			name: "Raj",
			gender: "Male",
			department: "CSE",
			batch: "July 2020",
			admissionThrough: "Regular",
			advisor1: "Dr. XYZ",
			studentStatus: "Active",
		},
		{
			rollNumber: "20D17004",
			name: "Riya",
			gender: "Female",
			department: "CSAI",
			batch: "July 2020",
			admissionThrough: "Regular",
			advisor1: "Dr. XYZ",
			studentStatus: "Active",
		},
		{
			rollNumber: "20D17005",
			name: "Ritu",
			gender: "Female",
			department: "CSD",
			batch: "July 2020",
			admissionThrough: "Regular",
			advisor1: "Dr. XYZ",
			studentStatus: "Active",
		},
	]);

	function sortByHead(head) {
		const headToProperty = {
			"Roll Number": "rollNumber",
			Name: "name",
			Gender: "gender",
			Department: "department",
			Batch: "batch",
			"Admission Through": "admissionThrough",
			"Advisor 1": "advisor1",
			"Student Status": "studentStatus",
		};
		head = headToProperty[head];

		data.sort((a, b) => {
			// console.log(a[headToProperty[head]], b[headToProperty[head]]); // a[headToProperty[head]] is same as a[head]
			if (a[head] < b[head]) {
				return -1;
			}
			if (a[head] > b[head]) {
				return 1;
			}
			return 0;
		});

		console.log(data);
		setData([...data]);
	}
	return (
		<Card className="h-full w-full">
			<CardHeader floated={false} shadow={false} className="rounded-none">
				<div className="mb-8 flex items-center justify-between gap-8">
					<div>
						<Typography variant="h5" color="blue-gray">
							Members list
						</Typography>
						<Typography color="gray" className="mt-1 font-normal">
							See information about all members
						</Typography>
					</div>
					<div className="flex shrink-0 flex-col gap-2 sm:flex-row">
						<Button variant="outlined" size="sm">
							view all
						</Button>
						<Button className="flex items-center gap-3" size="sm">
							<UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
						</Button>
					</div>
				</div>
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<Tabs value="all" className="w-full md:w-max">
						<TabsHeader>
							{TABS.map(({ label, value }) => (
								<Tab key={value} value={value}>
									&nbsp;&nbsp;{label}&nbsp;&nbsp;
								</Tab>
							))}
						</TabsHeader>
					</Tabs>
					<div className="w-full md:w-72">
						<Input
							label="Search"
							icon={<MagnifyingGlassIcon className="h-5 w-5" />}
						/>
					</div>
				</div>
			</CardHeader>
			<CardBody className="overflow-scroll px-0">
				<table className="mt-4 w-full min-w-max table-auto text-left">
					<thead>
						<tr>
							{TABLE_HEAD.map((head, index) => (
								<th
									onClick={() => sortByHead(head)}
									key={index}
									className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
									<Typography
										variant="small"
										color="blue-gray"
										className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
										{head}{" "}
										{index !== TABLE_HEAD.length - 1 && (
											<button
												onClick={() => {
													console.log("Sort by", head);
												}}>
												<ChevronUpDownIcon
													strokeWidth={2}
													className="h-4 w-4"
												/>
											</button>
										)}
									</Typography>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map(
							(
								{
									rollNumber,
									name,
									gender,
									department,
									batch,
									admissionThrough,
									advisor1,
									studentStatus,
								},
								index
							) => {
								const isLast = index === data.length - 1;
								const classes = isLast
									? "p-4"
									: "p-4 border-b border-blue-gray-50";

								return (
									<tr key={rollNumber} className="hover:bg-blue-gray-400">
										<td
											className={classes}
											onClick={() => console.log(rollNumber)}>
											<div className="flex items-center gap-3">
												<div className="flex flex-col">
													<Typography
														variant="small"
														color="blue-gray"
														className="font-normal">
														{rollNumber}
													</Typography>
												</div>
											</div>
										</td>
										<td className={classes}>
											<div className="flex flex-col">
												<Typography
													variant="small"
													color="blue-gray"
													className="font-normal">
													{name}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className="flex flex-col">
												<Typography
													variant="small"
													color="blue-gray"
													className="font-normal opacity-70">
													{gender}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className="flex flex-col">
												<Typography
													variant="small"
													color="blue-gray"
													className="font-normal">
													{department}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className="flex flex-col">
												<Typography
													variant="small"
													color="blue-gray"
													className="font-normal opacity-70">
													{batch}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className="flex flex-col">
												<Typography
													variant="small"
													color="blue-gray"
													className="font-normal opacity-70">
													{admissionThrough}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className="flex flex-col">
												<Typography
													variant="small"
													color="blue-gray"
													className="font-normal opacity-70">
													{advisor1}
												</Typography>
											</div>
										</td>
										<td className={classes}>
											<div className="w-max">
												<Chip
													variant="ghost"
													size="sm"
													value={
														studentStatus === "Active" ? "Active" : "Inactive"
													}
													color={studentStatus === "Active" ? "green" : "red"}
												/>
											</div>
										</td>
										{/* <td className={classes}>
											<Tooltip content="Edit User">
												<IconButton variant="text">
													<PencilIcon className="h-4 w-4" />
												</IconButton>
											</Tooltip>
										</td> */}
									</tr>
								);
							}
						)}
					</tbody>
				</table>
			</CardBody>
			<CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
				<Typography variant="small" color="blue-gray" className="font-normal">
					Page 1 of 10
				</Typography>
				<div className="flex gap-2">
					<Button variant="outlined" size="sm">
						Previous
					</Button>
					<Button variant="outlined" size="sm">
						Next
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
