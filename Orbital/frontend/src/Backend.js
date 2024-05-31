import axios from "axios";

//USER AND AUTH ROUTES

//SIGNIN
export const signin = (user) => {
    // API call to sign in a user
    return axios
        .post(
            "https://6310-smiley-server.vercel.app/api/signin",
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

//SIGNUP
export const signup = (user) => {
    // API call to sign up a user
    return axios
        .post(
            "https://6310-smiley-server.vercel.app/api/signup",
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            console.log(response.data);
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

//FORGETPASSWORD
export const forgetPasswordAuthentication = (user) => {
    // API call to check if user is in database
    return axios
        .post(
            "http://localhost:8000/api/forgetpassword",
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

export const forgetPasswordReset = (user, token) => {
    // API call to check if user is in database
    return axios
        .post(
            `http://localhost:8000/api/resetpassword/${token}`,
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

//SETTING THE JWT TOKEN IN USER'S BROWSER
export const authenticate = (data, next) => {
    // Storing JWT token in user's browser
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
};

//SIGNOUT -> REMOVING JWT TOKEN
export const signout = (next) => {
    // Removing JWT token upon signout
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");

        axios
            .get("http://localhost:8000/api/signout")
            .then((response) => {
                console.log(response.data);
                next();
            })
            .catch((err) => console.log(err));
    }
};

//VALIDATION IF USER IS SIGNED IN
export const isAuthenticated = () => {
    // Checking if the user is authenticated
    if (typeof window === "undefined") {
        return false;
    }
    if (localStorage.getItem("jwt"))
        return JSON.parse(localStorage.getItem("jwt"));
    else return false;
};

// TASK ROUTES

// Create Task
export const createTask = (task) => {
    // API call to create a task
    return axios
        .post("http://localhost:8000/tasks/createtask", JSON.stringify(task), {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

// Delete Tasks
export const deleteTask = async (taskId) => {
    try {
        const response = await axios.delete(
            `http://localhost:8000/tasks/deletetask/${taskId}`
        );
        return response.data; // Return response data
    } catch (error) {
        console.error(error);
        return { success: false, error: "Error deleting task." };
    }
};

// Get Tasks for User
export const getTasksForUser = (user) => {
    // API call to get courses
    return axios
        .post(
            "http://localhost:8000/tasks/gettasksforuser",
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

// Get Tasks for Course
export const getTasksForCourse = (course) => {
    // API call to get courses
    return axios
        .post(
            "http://localhost:8000/tasks/gettasksforcourse",
            JSON.stringify(course),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

// Complete Task
export const completeTask = (task) => {
    // API call to complete a task
    return axios
        .post(
            "http://localhost:8000/tasks/completetask",
            JSON.stringify(task),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

// Reverse Complete Task
export const reverseCompleteTask = (task) => {
    // API call to reverse complete a task
    return axios
        .post(
            "http://localhost:8000/tasks/reversecompletetask",
            JSON.stringify(task),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

// COURSE ROUTES

// Create Course
export const createCourse = (course) => {
    // API call to create a course
    return axios
        .post(
            "http://localhost:8000/courses/createcourse",
            JSON.stringify(course),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};

// Delete Courses
export const deleteCourse = async (courseId) => {
    try {
        const response = await axios.delete(
            `http://localhost:8000/courses/deletecourse/${courseId}`
        );
        return response.data; // Return response data
    } catch (error) {
        console.error(error);
        return { success: false, error: "Error deleting course." };
    }
};

// Get Courses
export const getCourses = (user) => {
    // API call to get courses
    return axios
        .post(
            "http://localhost:8000/courses/getcourses",
            JSON.stringify(user),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            return response.data; // Return response data
        })
        .catch((err) => {
            return err.response.data; // Return error response data
        });
};
