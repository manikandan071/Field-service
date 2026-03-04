export const getEmployeeDetails = async (
  setEmployeeDetails: (details: any) => void,
  spWeb: any,
  userEmail: string,
) => {
  try {
    const EmployeeWithDetails = await spWeb.list
      .getByTitle("EmployeeDetails")
      .items.get()
      .select("Employee")
      .then((items: any[]) => {
        const tempEmployeeDetails = items.map(
          async (employee: any, index: number) => {
            return {
              id: employee.id,
              employee: employee.Employee,
              skillSets: employee.SkillSets,
              role: employee.Role,
              level: employee.Level,
              address1: employee.Address1,
              address2: employee.Address2,
              address:
                employee.Address1 +
                ", " +
                employee.Address2 +
                ", " +
                employee.City,
              city: employee.City,
              contactNo: employee.ContactNo,
              contactEmail: employee.ContactEmail,
            };
          },
        );
        return tempEmployeeDetails || null;
      });
    setEmployeeDetails(
      EmployeeWithDetails.filter((emp: any) => emp.contactEmail === userEmail),
    );
  } catch (error) {
    console.error("Error fetching employee details:", error);
  }
};

// Fetch recent acctivities function

export const getActiveClockRecord = (userEmail: string, spWeb: any) => {
  try {
    const getActiveClockItem = spWeb.lists
      .getByTitle("ClockInOut")
      .select("*,Author/Id,Author/Title,Author/EMail")
      .expand("Author")
      .items.get()
      .then((res: any) => {
        const filtered = res.filter((item: any) => {
          const owner = item.createdBy;
          const clockOut = item.fields.ClockOut;
          return owner === userEmail && clockOut === false;
        });
        console.log("Filtered", filtered);
      });
    return getActiveClockItem;
  } catch (error) {
    console.log("Error :", error);
  }
};

export const clockIn = async (spWeb: any) => {
  try {
    await spWeb.lists.getByTitle("ClockInOut").items.add({
      StartTime: new Date().toISOString(),
      ClockOut: false,
    });
  } catch (error) {
    console.log("Error :", error);
  }
};

export const clockOut = async (spWeb: any, recId: number) => {
  try {
    await spWeb.lists.getByTitle("ClockInOut").items.getById(recId).update({
      EndTime: new Date().toISOString(),
      ClockOut: true,
    });
  } catch (error) {
    console.log("Error :", error);
  }
};

// Fetch all jobs function

export const getjobsDetails = async (spWeb: any, setAllJobs: any) => {
  try {
    await spWeb.lists
      .getByTitle("Jobs")
      .items.select(
        "*,Author/Id,Author/Title,Author/EMail,Customer/Id,Customer/Address1,Customer/Address2,Customer/City,Customer/FirstName,Customer/LastName,Customer/ContactNo,Customer/ContactEmail",
      )
      .expand("Author,Customer")
      .get()
      .then((res: any) => {
        const tempJobDetails = res.map((job: any) => {
          return {
            id: Number(job.id),
            title: job.fields.Title,
            status: job.fields.Status,
            priority: job.fields.Priority,
            startDate: job.fields.StartDate,
            endDate: job.fields.EndDate,
            customerRating: job.fields.Rating,
            customerFeedback: job.fields.FeedBacks,
            customerId: job.Customer,
            firstName: job.Customer,
            lastName: job.Customer,
            customer: job.Customer + " " + job.Customer,
            address1: job.Customer,
            address2: job.Customer,
            address: job.Customer + ", " + job.Customer + ", " + job.Customer,
            city: job.Customer,
            contactNo: job.Customer,
            contactEmail: job.Customer,
          };
        });
        setAllJobs(tempJobDetails);
      });
  } catch (error) {
    console.log("Error :", error);
  }
};
