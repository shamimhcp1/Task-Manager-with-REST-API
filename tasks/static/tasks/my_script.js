const app = document.getElementById('app');

// change Password
const ChangePassword = ({ getMessage, setMessage, currentView, setCurrentView, user, setUser,
    activeMenuItem, handleMenuClick }) => {
    // submitChangePasswordForm
    const submitChangePasswordForm = (e) => {
        e.preventDefault();
        const form = document.getElementById('changePasswordForm');
        const formData = new FormData(form);

        // formDataObject is a plain object with key-value pairs
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        fetch('/tasks/change-password/', {
            method: 'PUT',
            body: JSON.stringify(formDataObject),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Include the CSRF token
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === 'success') {
                    console.log('Password changed successfully');
                } else {
                    console.log('Failed to change password. Status:', data.status);
                }
                setMessage(data.message); // Update message
                form.reset(); // Reset the form
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Internal Server Error'); // Use a generic error message here
                form.reset(); // Reset the form
            });
    };

    return (
        <div class="col-md-12 col-lg-6">
            {getMessage && (
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    {getMessage}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Change Password</h5>
                </div>
                <div class="card-body">
                    <form method="POST" action="" id="changePasswordForm">
                        <div class="form-floating form-floating-outline mb-4">
                            <input type="password" class="form-control" id="current_password" name="current_password" placeholder="Current Password" />
                            <label for="current_password">Current Password</label>
                        </div>
                        <div class="form-floating form-floating-outline mb-4">
                            <input type="password" class="form-control" id="new_password" name="new_password" placeholder="New Password" />
                            <label for="new_password">New Password</label>
                        </div>
                        <div class="form-floating form-floating-outline mb-4">
                            <input type="password" class="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm New Password" />
                            <label for="confirm_password">Confirm New Password</label>
                        </div>
                        <button type="submit" class="btn btn-primary" onClick={submitChangePasswordForm}>Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Footer
const Footer = ({user, setUser}) => {
    return (
        <dev>
            <footer className="content-footer footer bg-footer-theme">
                <div className="container-xxl">
                    <div
                        className="footer-container d-flex align-items-center justify-content-between py-3 flex-md-row flex-column">
                        <div className="text-body mb-2 mb-md-0">
                            ©2024, made with <span className="text-danger"><i className="tf-icons mdi mdi-heart"></i></span> by: <a href="https://github.com/shamimhcp1" className="footer-link me-3" target="_blank">Shamim Hossain</a>

                        </div>
                    </div>
                </div>
            </footer>
        </dev>
    );
};

{/* Search Input */}
const SearchInput = ({ searchQuery, setSearchQuery, currentView, setCurrentView, user, setUser,
    activeMenuItem, handleMenuClick }) => {
   
    return (
      <div className="navbar-nav align-items-center">
        <div className="nav-item d-flex align-items-center">
            <i className="mdi mdi-magnify mdi-24px lh-0"></i>
            <input
                type="text"
                className="form-control border-0 shadow-none bg-body"
                placeholder="Search ..."
                aria-label="Search ..."
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setCurrentView('tasks-list');} }
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                    }
                }}
            />
        </div>
      </div>
    );
};

const Sidebar = ({ currentView, handleMenuClick, activeMenuItem, user, setUser }) => {

    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme open">
            <div className="app-brand demo">
                <a href="/tasks" className="app-brand-link">
                    <span className="app-brand-text demo menu-text fw-semibold ms-2">Task Manager</span>
                </a>

                <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto">
                    <i className="mdi menu-toggle-icon d-xl-block align-middle mdi-20px"></i>
                </a>
            </div>

            <div className="menu-inner-shadow"></div>

            <ul className="menu-inner py-1">
                {/* <!-- Tasks --> */}
                <li className={`menu-item ${activeMenuItem === 'tasks-list' || currentView === 'tasks-list' ? 'active open' : ''}`}>
                    <a
                        href="javascript:void(0);"
                        className="menu-link"
                        onClick={() => handleMenuClick('tasks-list')}>
                        <i className="menu-icon tf-icons mdi mdi-format-list-checks"></i>
                        <div data-i18n="Email">Tasks</div>
                    </a>
                </li>
                {/* <!-- Create --> */}
                <li className={`menu-item ${activeMenuItem === 'tasks-create' || currentView === 'tasks-create' ? 'active open' : ''}`}>
                    <a
                        href="javascript:void(0);"
                        className="menu-link"
                        onClick={() => handleMenuClick('tasks-create')}>
                        {/* create icon */}
                        <i className="menu-icon tf-icons mdi mdi-plus-circle-outline"></i>
                        <div data-i18n="Email">Create</div>
                    </a>
                </li>
            </ul>
        </aside>
    );
};

const Navbar = ({ currentView, setCurrentView, handleMenuClick, user, setUser, searchQuery, setSearchQuery  }) => {
    
    // toggleSidebar
    const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true); // Add this line

    const toggleSidebar = (e) => {
        e.stopPropagation(); // Stop the click event propagation
        setIsSidebarExpanded(!isSidebarExpanded);
    };
    // to apply/remove the class to the html tag based on the sidebar state
    React.useEffect(() => {
        const htmlTag = document.querySelector('html');
        if (isSidebarExpanded) {
            htmlTag.classList.add('layout-menu-expanded');
        } else {
            htmlTag.classList.remove('layout-menu-expanded');
        }
    }, [isSidebarExpanded]);


    // close the sidebar when clicking outside of it
    React.useEffect(() => {
        const handleOutsideClick = (e) => {
            const layoutMenu = document.getElementById('layout-menu');
            if (layoutMenu && !layoutMenu.contains(e.target)) {
                setIsSidebarExpanded(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []); // Empty dependency array means this effect runs once when the component mounts


    return (
        <div>
            {/* <!-- Navbar --> */}
            <nav
                className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
                id="layout-navbar">
                <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                    <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)"
                        onClick={toggleSidebar}
                    >
                        <i className="mdi mdi-menu mdi-24px"></i>
                    </a>
                </div>

                <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                    {/* <!-- Search --> */}
                    <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                        currentView={currentView} setCurrentView={setCurrentView} />
                    {/* <!-- /Search --> */}

                    <ul className="navbar-nav flex-row align-items-center ms-auto">

                        {/* <!-- User --> */}
                        <li className="nav-item navbar-dropdown dropdown-user dropdown">
                            <a
                                className="nav-link dropdown-toggle hide-arrow p-0"
                                href="javascript:void(0);"
                                data-bs-toggle="dropdown">
                                <div className="avatar avatar-online">
                                    <img src="/static/tasks/assets/img/avatars/1.png" alt className="w-px-40 h-auto rounded-circle" />
                                </div>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end mt-3 py-2">
                                <li>
                                    <a className="dropdown-item pb-2 mb-1" href="#" onClick={(e) => { e.preventDefault(); }}>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0 me-2 pe-1">
                                                <div className="avatar avatar-online">
                                                    <img src="/static/tasks/assets/img/avatars/1.png" alt className="w-px-40 h-auto rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0">
                                                    {user.username}
                                                </h6>
                                                {/* user role */}
                                                <small className="text-muted">
                                                    {/* superuser else user */}
                                                    {user.is_superuser ? 'Superuser' : 'User'}
                                                </small>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <div className="dropdown-divider my-1"></div>
                                </li>

                                <li>
                                    <a className="dropdown-item" href="#"
                                        onClick={(e) => { e.preventDefault(); handleMenuClick('change-password'); }}>
                                        <i className="mdi mdi-key-outline me-1 mdi-20px"></i>
                                        <span className="align-middle">Change Password</span>
                                    </a>
                                </li>
                                <li>
                                    <div className="dropdown-divider my-1"></div>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="/tasks/logout">
                                        <i className="mdi mdi-power me-1 mdi-20px"></i>
                                        <span className="align-middle">Log Out</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        {/* <!--/ User --> */}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

// create task form
const CreateTask = ({ getMessage, setMessage, currentView, setCurrentView, user, setUser, 
    activeMenuItem, handleMenuClick}) => {
    // submitCreateTaskForm
    const submitCreateTaskForm = (e) => {
        e.preventDefault();
        const form = document.getElementById('createTaskForm');
        const formData = new FormData(form);

        fetch('/tasks/create-task/', {
            method: 'POST',
            body: formData, // Use formData directly
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === 'success') {
                    console.log('Task created successfully');    
                    setCurrentView('tasks-list'); // Set the view tasks-list
                } else {
                    console.log('Failed to create task. Status:', data.status);
                }
                setMessage(data.message); // Update message
                form.reset(); // Reset the form
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Internal Server Error'); // Use a generic error message here
            });
    };

    return (
        <div className="col-md-12 col-lg-6">
            {getMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {getMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Create Task</h5>
                </div>
                <div className="card-body">
                    <form method="POST" action="" id="createTaskForm" encType="multipart/form-data" >
                        {/* Title */}
                        <div className="form-floating form-floating-outline mb-4">
                            <input type="text" className="form-control" id="title" name="title" placeholder="Title" />
                            <label htmlFor="title">Title</label>    
                        </div>
                        {/* Description */}
                        <div className="form-floating form-floating-outline mb-4">
                            <textarea className="form-control" id="description" name="description" placeholder="Description" rows="3"></textarea>
                            <label htmlFor="description">Description</label>
                        </div>
                        {/* Due Date */}
                        <div className="form-floating form-floating-outline mb-4">
                            <input type="date" className="form-control" id="due_date" name="due_date" placeholder="Due Date" />
                            <label htmlFor="due_date">Due Date</label>
                        </div>
                        {/* Photos */}
                        <div className="form-floating form-floating-outline mb-4">
                            <input type="file" className="form-control" id="photos" name="photos" placeholder="Photos" multiple />
                            <label htmlFor="photos">Photos</label>
                        </div>
                        {/* priority*/}
                        <p><small>Priority</small></p>
                        <div className="form-floating form-floating-outline mb-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="priority" id="priority_low" value="low" />
                                <label className="form-check-label" htmlFor="priority_low">Low</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="priority" id="priority_medium" value="medium" />
                                <label className="form-check-label" htmlFor="priority_medium">Medium</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="priority" id="priority_high" defaultChecked value="high" />
                                <label className="form-check-label" htmlFor="priority_high">High</label>
                            </div>
                        </div>
                        {/* Status */}
                        <p><small>Status</small></p>
                        <div className="form-floating form-floating-outline mb-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="is_complete" id="is_complete_true" value="1" />
                                <label className="form-check-label" htmlFor="is_complete_true">Complete</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="is_complete" defaultChecked id="is_complete_false" value="0" />
                                <label className="form-check-label" htmlFor="is_complete_false">In-complete</label>
                            </div>
                        </div>
                        {/* Assign To */}
                        {/* <div className="form-floating form-floating-outline mb-4">
                            <select className="form-select" id="assign_to" name="assign_to" aria-label="Assign To">
                                <option selected>Assign To</option>
                                <option value="1">Shamim</option>
                                <option value="2">Rakib</option>
                                <option value="3">Rakib</option>
                            </select>
                            <label htmlFor="assign_to">Assign To</label>
                        </div> */}
                        <button type="submit" className="btn btn-primary" onClick={submitCreateTaskForm}>Create</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Tasks List
const TasksList = ({ currentView, setCurrentView, getMessage, setMessage, user, setUser,
    detailViewTask, taskPhotos, setDetailViewTask, setTaskPhotos, activeMenuItem, handleMenuClick, 
    tasksList, setTasksList
    }) => {
    
    // fetch tasks list
    React.useEffect(() => {
        fetch('/tasks/tasks-list')
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.status === 'success') {
                    setTasksList(data.tasksList);
                } else {
                    console.log('Failed to fetch tasks list. Status:', data.status);
                }
                setMessage(data.message); // Update message
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Internal Server Error'); // Use a generic error message here
            });
    }, []);

    // delete Task
    const deleteTask = (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            fetch(`/tasks/delete-task/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.status === 'success') {
                    console.log('Task deleted successfully');
                    // remove the deleted task from the tasksList
                    const updatedTasksList = tasksList.filter(task => task.id !== id);
                    setTasksList(updatedTasksList);
                } else {
                    console.log('Failed to delete task. Status:', data.status);
                }
                setMessage(data.message); // Update message
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Internal Server Error'); // Use a generic error message here
            })
            .finally(() => {
                setCurrentView('tasks-list'); // Set the view regardless of success or failure
            });
        }
    };
    
    // viewTask with photos
    const viewTask = (id) => {
        fetch(`/tasks/view-task/${id}`)
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.status === 'success') {
                    console.log('Task viewed successfully');
                    setDetailViewTask(data.task);
                    setTaskPhotos(data.photos);
                    setCurrentView('view-task'); // Set the view
                } else {
                    console.log('Failed to view task. Status:', data.status);
                }
                setMessage(data.message); // Update message
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Internal Server Error'); // Use a generic error message here
            });
    };

    // handleFilterClick
    const [isFilterVisible, setIsFilterVisible] = React.useState(false);
    const handleFilterClick = () => {
        setIsFilterVisible(!isFilterVisible); // Toggle the filter visibility
    };


    return (
        <div>
            {getMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {getMessage}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
            )}
            
            {/* filter */}
            {isFilterVisible && (
            <TasksFilter 
            tasksList={tasksList} setTasksList={setTasksList} handleFilterClick={handleFilterClick}
            currentView={currentView} setCurrentView={setCurrentView} getMessage={getMessage} setMessage={setMessage}
            />)}
            
            <div className="col-md-12 col-lg-12">
                <div className="card">
                    <h5 className="card-header">Tasks List
                        {/* filter */}
                        <button type="button" className="btn btn-primary btn-sm float-end" onClick={(e) => { e.preventDefault(); handleFilterClick(); }}>
                            <i className="mdi mdi-filter-variant me-1"></i>
                            Filter
                        </button>
                    </h5>
                    <div className="table-responsive text-nowrap">
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-truncate">SL</th>
                                    <th className="text-truncate">Title</th>
                                    <th className="text-truncate">Priority</th>
                                    <th className="text-truncate">Status</th>
                                    <th className="text-truncate">Due Date</th>
                                    <th className="text-truncate">Assign To</th>
                                    <th className="text-truncate">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* display loading bar before buyerlist show */}
                                {tasksList.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                
                                {tasksList.map((task, index) => (
                                    <tr key={index}>
                                        <td className="text-truncate">{index + 1}</td>
                                        <td className="text-truncate">{task.title}</td>
                                        <td className="text-truncate">
                                            {task.priority === 'low' ? <span className="badge bg-success">Low</span> : task.priority === 'medium' ? <span className="badge bg-warning">Medium</span> : <span className="badge bg-danger">High</span>}
                                        </td>
                                        <td className="text-truncate">
                                            {task.is_complete ? <span className="badge bg-success">Complete</span> : <span className="badge bg-danger">In-complete</span>}
                                        </td>
                                        <td className="text-truncate">
                                            {/* due_date format only date dd-mm-yyyy */}
                                            {task.due_date.split('T')[0].split('-').reverse().join('-')}
                                        </td>
                                        <td className="text-truncate">
                                            {task.assign_to}
                                    </td>
                                        <td className="text-truncate">
                                            <div className="dropdown">
                                                <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                    <i className="mdi mdi-dots-vertical"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    {/* view */}
                                                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); viewTask(task.id); }}>
                                                        <i className="mdi mdi-eye-outline me-1"></i> View
                                                    </a>
                                                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); viewTask(task.id); }}>
                                                        <i className="mdi mdi-pencil-outline me-1"></i> Edit
                                                    </a>
                                                    {/* delete */}
                                                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); deleteTask(task.id); }}>
                                                        <i className="mdi mdi-trash-can-outline me-1"></i> Delete
                                                    </a>

                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

// View Task
const ViewTask = ({ currentView, setCurrentView, getMessage, setMessage, user, setUser,
    detailViewTask, taskPhotos, setDetailViewTask, setTaskPhotos, activeMenuItem, handleMenuClick }) => {

    // delete Task Photo
    const deleteTaskPhoto = (id) => {
        if (confirm('Are you sure you want to delete this photo?')) {
            fetch(`/tasks/delete-task-photo/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.status === 'success') {
                    console.log('Task photo deleted successfully');
                    // remove the deleted task photo from the taskPhotos
                    const updatedTaskPhotos = taskPhotos.filter(photo => photo.id !== id);
                    setTaskPhotos(updatedTaskPhotos);
                } else {
                    console.log('Failed to delete task photo. Status:', data.status);
                }
                setMessage(data.message); // Update message
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Internal Server Error'); // Use a generic error message here
            })
            .finally(() => {
                setCurrentView('view-task'); // Set the view regardless of success or failure
            });
        }
    };

    // submitUpdateTaskForm
    const submitUpdateTaskForm = (e) => {
        e.preventDefault();
        const form = document.getElementById('updateTaskForm');
        const formData = new FormData(form);

        const data = {};
        formData.forEach((value, key) => {data[key] = value});

        fetch(`/tasks/update-task/${detailViewTask.id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // Include the CSRF token
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === 'success') {
                    console.log('Task updated successfully');
                    setCurrentView('tasks-list'); // Set the view tasks-list
                } else {
                    console.log('Failed to update task. Status:', data.status);
                }
                setMessage(data.message); // Update message
                form.reset(); // Reset the form
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Internal Server Error'); // Use a generic error message here
                form.reset(); // Reset the form
            });
    }
    // get all user list
    const [usersList, setUsersList] = React.useState([]);
    React.useEffect(() => {
        fetch('/tasks/user-list')
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.status === 'success') {
                    setUsersList(data.usersList);
                } else {
                    console.log('Failed to fetch user list. Status:', data.status);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div className="col-md-12 col-lg-6">
            {getMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {getMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">View & Update Task</h5>
                </div>
                <div className="card-body">
                    <form method="POST" action="" id="updateTaskForm" encType="multipart/form-data" >
                        {/* Title */}
                        <div className="form-floating form-floating-outline mb-4">
                            <input type="hidden" name="id" value={detailViewTask.id} />
                            <input type="text" className="form-control" id="title" name="title" placeholder="Title" 
                            value={detailViewTask.title}
                            onChange={(e) => { setDetailViewTask({ ...detailViewTask, title: e.target.value }); }}
                            />
                            <label htmlFor="title">
                                Title
                            </label>    
                        </div>
                        {/* Description */}
                        <div className="form-floating form-floating-outline mb-4">
                            <textarea className="form-control" id="description" name="description" placeholder="Description" rows="3"
                            onChange={(e) => { setDetailViewTask({ ...detailViewTask, description: e.target.value }); }}
                            value={detailViewTask.description}
                            ></textarea>
                            <label htmlFor="description">
                                Description
                            </label>
                            
                        </div>
                        {/* Due Date */}
                        <div className="form-floating form-floating-outline mb-4">
                            <input type="date" className="form-control" id="due_date" name="due_date" placeholder="Due Date" 
                            // from django date to html date format
                            value={detailViewTask.due_date.split('T')[0]}
                            onChange={(e) => { setDetailViewTask({ ...detailViewTask, due_date: e.target.value }); }}
                            />
                            <label htmlFor="due_date">
                                Due Date
                            </label>
                        </div>
                        {/* Photos */}
                        <div className="form-floating form-floating-outline mb-4">
                            <input type="file" className="form-control" id="photos" name="photos" placeholder="Photos" multiple />
                            <label htmlFor="photos">Photos</label>
                        </div>
                        {/* show photos from taskPhotos*/}
                        {taskPhotos.length > 0 && (
                            <div className="row">
                                {taskPhotos.map((photo, index) => (
                                    <div className="col-md-4 col-lg-4" key={index}>
                                        <div className="card mb-4">
                                            <img src={`${window.location.origin}/tasks${photo.image}`} className="card-img-top" alt="..." />
                                            {/* delete photo */}
                                            <button type="button" className="btn btn-danger btn-sm" 
                                            onClick={(e) => { e.preventDefault(); deleteTaskPhoto(photo.id); }}
                                            >
                                                <i className="mdi mdi-trash-can-outline me-1"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* priority*/}
                        <div className="form-floating form-floating-outline mb-4">
                            <p><small>Priority</small></p>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="priority" id="priority_low" value="low" 
                                defaultChecked={detailViewTask.priority === 'low' ? true : false}
                                onChange={(e) => { setDetailViewTask({ ...detailViewTask, priority: e.target.value }); }}
                                />
                                <label className="form-check-label" htmlFor="priority_low">Low</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="priority" id="priority_medium" value="medium" 
                                defaultChecked={detailViewTask.priority === 'medium' ? true : false}
                                onChange={(e) => { setDetailViewTask({ ...detailViewTask, priority: e.target.value }); }}
                                />
                                <label className="form-check-label" htmlFor="priority_medium">Medium</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="priority" id="priority_high" value="high" 
                                defaultChecked={detailViewTask.priority === 'high' ? true : false}
                                onChange={(e) => { setDetailViewTask({ ...detailViewTask, priority: e.target.value }); }}
                                />
                                <label className="form-check-label" htmlFor="priority_high">High</label>
                            </div>
                        </div>
                        {/* Status */}
                        <div className="form-floating form-floating-outline mb-4">
                            <p><small>Status</small></p>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="is_complete" id="is_complete_true" value="1" 
                                defaultChecked={detailViewTask.is_complete ? true : false}
                                onChange={(e) => { setDetailViewTask({ ...detailViewTask, is_complete: e.target.value }); }}
                                />
                                <label className="form-check-label" htmlFor="is_complete_true">Complete</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="is_complete" id="is_complete_false" value="0" 
                                defaultChecked={detailViewTask.is_complete ? false : true}
                                onChange={(e) => { setDetailViewTask({ ...detailViewTask, is_complete: e.target.value }); }}
                                />
                                <label className="form-check-label" htmlFor="is_complete_false">In-complete</label>
                            </div>
                        </div>
                        {/* Assign To */}
                        {user.is_superuser && (
                            <div className="form-floating form-floating-outline mb-4">
                                <select className="form-select" id="user" name="user" aria-label="Assign To"
                                onChange={(e) => { setDetailViewTask({ ...detailViewTask, user: e.target.value }); }}
                                value={detailViewTask.user}
                                >
                                    <option>--</option>
                                    {usersList.map((user, index) => (
                                        <option key={index} value={user.id}>{user.username}</option>
                                    ))}
                                </select>
                                <label htmlFor="user">Assign To</label>
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary"  onClick={submitUpdateTaskForm} >Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Tasks Filter
const TasksFilter = (
    { getMessage, setMessage, currentView, setCurrentView,
        handleFilterClick, tasksList, setTasksList }
) => {

    // submitFilterTaskForm
    const submitFilterTaskForm = (e) => {
        e.preventDefault();
        const form = document.getElementById('filterTaskForm');
        const formData = new FormData(form);

        fetch('/tasks/filter-task/', {
            method: 'POST',
            body: formData, // Use formData directly
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === 'success') {
                    console.log('Task filtered successfully');    
                    setTasksList(data.tasksList);
                    handleFilterClick(); // close the filter
                } else {
                    console.log('Failed to filter task. Status:', data.status);
                }
                setMessage(data.message); // Update message
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Internal Server Error'); // Use a generic error message here
            });
    };

    return (
        <div className="col-md-12 col-lg-6">
                <div className="card mb-12">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Filter Task</h5>
                    </div>
                    <div className="card-body">
                        <form method="POST" action="" id="filterTaskForm" >
                            {/* Create Date */}
                            <div className="form-floating form-floating-outline mb-4">
                                <input type="date" className="form-control" id="creation_date" name="creation_date" placeholder="Creation Date" />
                                <label htmlFor="creation_date">Create Date</label>
                            </div>
                            {/* Due Date */}
                            <div className="form-floating form-floating-outline mb-4">
                                <input type="date" className="form-control" id="due_date" name="due_date" placeholder="Due Date" />
                                <label htmlFor="due_date">Due Date</label>
                            </div>
                            {/* priority*/}
                            <p><small>Priority</small></p>
                            <div className="form-floating form-floating-outline mb-4">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="priority" id="priority_low" value="low" />
                                    <label className="form-check-label" htmlFor="priority_low">Low</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="priority" id="priority_medium" value="medium" />
                                    <label className="form-check-label" htmlFor="priority_medium">Medium</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="priority" id="priority_high" value="high" />
                                    <label className="form-check-label" htmlFor="priority_high">High</label>
                                </div>
                            </div>
                            {/* Status */}
                            <p><small>Status</small></p>
                            <div className="form-floating form-floating-outline mb-4">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="is_complete" id="is_complete_true" value="1" />
                                    <label className="form-check-label" htmlFor="is_complete_true">Complete</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="is_complete" id="is_complete_false" value="0" />
                                    <label className="form-check-label" htmlFor="is_complete_false">In-complete</label>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" 
                            onClick={submitFilterTaskForm}
                            >Apply Filter</button>
                            {/* close button outline */}
                            <button type="button" className="btn btn-outline-primary ms-2" onClick={(e) => { e.preventDefault(); handleFilterClick(); }}>Close</button>
                            
                        </form>
                    </div>
                </div>
                <hr />
            </div>
    );
};
    

const App = () => {
    
    // keep updated buyer in a react state veriable
    const [getMessage, setMessage] = React.useState(null);
    const [currentView, setCurrentView] = React.useState('tasks-list');
    const [activeMenuItem, setActiveMenuItem] = React.useState(null);

    // keep view-task with photos in a react state veriable
    const [tasksList, setTasksList] = React.useState([]);
    const [detailViewTask, setDetailViewTask] = React.useState({});
    const [taskPhotos, setTaskPhotos] = React.useState([]);

    // search
    const [searchQuery, setSearchQuery] = React.useState('');
    // search task with searchQuery
    React.useEffect(() => {
        fetch(`/tasks/search-task/${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.status === 'success') {
                    setTasksList(data.tasksList);
                } else {
                    console.log('Failed to fetch tasks list. Status:', data.status);
                }
                setMessage(data.message); // Update message
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Internal Server Error'); // Use a generic error message here
            })
    }, [searchQuery === '' ? null : searchQuery]);

    // get logged in user details
    const [user, setUser] = React.useState({});
    React.useEffect(() => {
        fetch('/tasks/get-user-details')
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.status === 'success') {
                    setUser(data.user);
                } else {
                    console.log('Failed to fetch user details. Status:', data.status);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);
    
    // useEffect to remove the message after 10 seconds
    setTimeout(() => {
        setMessage(null);
    }, 10000);


    const handleMenuClick = (view) => {
        setCurrentView(view); // Update currentView
        window.history.pushState(null, '', view); // Update the URL
        console.log('CurrentView: ' + view);
        setActiveMenuItem(activeMenuItem === view ? null : view);
    };
    
    window.addEventListener('popstate', (event) => {
        // Handle back/forward navigation here
        // You can access the current URL from event.state or window.location.pathname
        let path = window.location.pathname
        let [, view] = path.split("/tasks/") // get the view from url
        setCurrentView(view); // Update currentView
    });

    return (
        <div>
            {/* <!-- Layout wrapper --> */}
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    {/* <!-- Menu --> */}
                    <Sidebar currentView={currentView} setCurrentView={setCurrentView}
                        handleMenuClick={handleMenuClick} activeMenuItem={activeMenuItem} 
                        user={user} setUser={setUser} 
                        getMessage={getMessage} setMessage={setMessage} 
                        />
                    {/* <!-- / Menu --> */}

                    {/* <!-- Layout container --> */}
                    <div className="layout-page">

                        {/* <!-- Navbar --> */}
                        <Navbar handleMenuClick={handleMenuClick} activeMenuItem={activeMenuItem} 
                            user={user} setUser={setUser} 
                            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                            currentView={currentView} setCurrentView={setCurrentView} 
                             />
                        {/* <!-- / Navbar --> */}

                        {/* <!-- Content wrapper --> */}
                        <div className="content-wrapper">
                            {/* <!-- Content --> */}
                            <div className="container-xxl flex-grow-1 container-p-y">
                                <div className="row gy-4">
                                    
                                    {/* tasks-list */}
                                    {currentView === 'tasks-list' && <TasksList
                                        getMessage={getMessage} setMessage={setMessage}
                                        currentView={currentView} setCurrentView={setCurrentView} 
                                        detailViewTask={detailViewTask} taskPhotos={taskPhotos} 
                                        setDetailViewTask={setDetailViewTask} setTaskPhotos={setTaskPhotos} 
                                        user={user} setUser={setUser} 
                                        activeMenuItem={activeMenuItem} handleMenuClick={handleMenuClick}
                                        tasksList={tasksList} setTasksList={setTasksList}
                                        />}
                                    
                                    {/* search-result */}

                                    {/* tasks-create */}
                                    {currentView === 'tasks-create' && <CreateTask
                                        getMessage={getMessage} setMessage={setMessage}
                                        currentView={currentView} setCurrentView={setCurrentView} 
                                        user={user} setUser={setUser} 
                                        activeMenuItem={activeMenuItem} handleMenuClick={handleMenuClick}
                                        />}
                                    
                                    {/* change-password */}
                                    {currentView === 'change-password' && <ChangePassword
                                        getMessage={getMessage} setMessage={setMessage}
                                        currentView={currentView} setCurrentView={setCurrentView} 
                                        user={user} setUser={setUser} 
                                        activeMenuItem={activeMenuItem} handleMenuClick={handleMenuClick}
                                        />}
                                    
                                    {/* view-task */}
                                    {currentView === 'view-task' && <ViewTask
                                        getMessage={getMessage} setMessage={setMessage}
                                        currentView={currentView} setCurrentView={setCurrentView}
                                        detailViewTask={detailViewTask} taskPhotos={taskPhotos} 
                                        setDetailViewTask={setDetailViewTask} setTaskPhotos={setTaskPhotos} 
                                        user={user} setUser={setUser} 
                                        activeMenuItem={activeMenuItem} handleMenuClick={handleMenuClick}
                                        />}
                                    

                                </div>
                            </div>
                            {/* <!-- / Content --> */}

                            {/* <!-- Footer --> */}
                            <Footer />
                            {/* <!-- / Footer --> */}

                            <div className="content-backdrop fade"></div>
                        </div>
                        {/* <!-- Content wrapper --> */}
                    </div>
                    {/* <!-- / Layout page --> */}
                </div>

                {/* <!-- Overlay --> */}
                <div className="layout-overlay layout-menu-toggle"></div>
            </div>
            {/* <!-- / Layout wrapper --> */}

        </div>
    );
}

// Function to get CSRF token from cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

ReactDOM.render(<App />, app);