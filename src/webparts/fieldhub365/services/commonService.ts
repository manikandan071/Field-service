export const getEmployeeDetails = async (
  setEmployeeDetails: (details: any) => void,
  spWeb: any,
  userEmail: string,
) => {
  try {
    const user = await spWeb.currentUser.get();
    const items = await spWeb.lists
      .getByTitle("EmployeeDetails")
      .select("*,Employee/Id,Employee/Title,Employee/EMail")
      .expand("Employee")
      .items.get();

    const tempEmployeeDetails = items.map((employee: any) => ({
      id: employee.Id,
      employee: employee.Employee,
      employeeId: employee.EmployeeId,
      skillSets: employee.SkillSets,
      role: employee.Role,
      level: employee.Level,
      address1: employee.Address1,
      address2: employee.Address2,
      address: `${employee.Address1}, ${employee.Address2}, ${employee.City}`,
      city: employee.City,
      contactNo: employee.ContactNo,
      contactEmail: employee.ContactEmail,
    }));

    const EmployeeWithDetails = tempEmployeeDetails.find(
      (emp: any) => emp.employeeId === user.Id,
    );

    setEmployeeDetails({
      ...EmployeeWithDetails,
      employee: user.Title,
      contactEmail: user.Email,
    });
  } catch (error) {
    console.error("Error fetching employee details:", error);
  }
};

// Fetch recent acctivities function

export const getActiveClockRecord = (userId: number, spWeb: any) => {
  try {
    const getActiveClockItem = spWeb.lists
      .getByTitle("ClockInOut")
      .select("*,Author/Id,Author/Title,Author/EMail")
      .expand("Author")
      .items.get()
      .then((res: any) => {
        const filtered = res.filter((item: any) => {
          const owner = item.AuthorId;
          const clockOut = item.ClockOut;
          return owner === userId && clockOut === false;
        });
        console.log("Filtered", filtered);
        return filtered;
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
    const customerDetails = await spWeb.lists
      .getByTitle("CustomerDetails")
      .items.get()
      .then((res: any) => {
        const tempCustomerDetails = res.map((customer: any) => {
          return {
            id: customer.Id,
            address1: customer.Address1,
            address2: customer.Address2,
            city: customer.City,
            contactNo: customer.ContactNo,
            contactEmail: customer.ContactEmail,
            firstName: customer.FirstName,
            lastName: customer.LastName,
          };
        });
        return tempCustomerDetails;
      });
    await spWeb.lists
      .getByTitle("Jobs")
      .select("*,Author/Id,Author/Title,Author/EMail,Customer/Id")
      .expand("Author,Customer")
      .items.get()
      .then((res: any) => {
        debugger;
        const tempJobDetails = res.map((job: any) => {
          const customer = customerDetails.find(
            (customer: any) => customer?.id === job.CustomerId,
          );
          return {
            id: job.Id,
            title: job.Title,
            status: job.Status,
            priority: job.Priority,
            startDate: job.StartDate,
            endDate: job.EndDate,
            customerRating: job.Rating,
            customerFeedback: job.FeedBacks,
            customerId: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            customer: customer.firstName + " " + customer.lastName,
            address1: customer.address1,
            address2: customer.address2,
            address:
              customer.address1 +
              ", " +
              customer.address2 +
              ", " +
              customer.city,
            city: customer.city,
            contactNo: customer.contactNo,
            contactEmail: customer.contactEmail,
          };
        });
        setAllJobs(tempJobDetails);
      });
  } catch (error) {
    console.log("Error :", error);
  }
};

// Fetch recent acctivies functions

export const getAllActivities = async (
  spWeb: any,
  setRecentActivities: any,
) => {
  try {
    await spWeb.lists
      .getByTitle("Activities")
      .select("*,Job/Id")
      .expand("Job")
      .items.get()
      .then((res: any) => {
        debugger;
        const tempJobDetails = res.map((activity: any) => {
          return {
            id: activity.id,
            title: activity.Title,
            description: activity.Description,
            job: activity.JobId,
            created: activity.Created,
          };
        });
        setRecentActivities(tempJobDetails);
      });
  } catch (error) {
    console.log("Error :", error);
  }
};
