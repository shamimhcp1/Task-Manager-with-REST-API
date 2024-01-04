const app = document.getElementById('app');

// change Password
const ChangePassword = ({ getMessage, setMessage, currentView, setCurrentView, }) => {
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

        fetch('/tasks/change-password', {
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
const Footer = () => {
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
const SearchInput = ({ searchQuery, setSearchQuery, currentView, setCurrentView }) => {
   
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
                onChange={(e) => {setSearchQuery(e.target.value); setCurrentView('search-result');} }
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

{/* Search Result */}
const SearchResult = ({ currentView, setCurrentView, searchQuery,
    getMessage, setMessage
    }) => {
    
    React.useEffect(() => {
        fetch(`/tasks/search?query=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.status === 'success') {
                    setCurrentView('search-result');
                }
                else {
                    console.log('Failed to fetch search result. Status:', data.status);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            }
            );
    }, [searchQuery]);

        return (
            <div className="col-md-12 col-lg-12">
                {getMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {getMessage}
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                <div className="card">
                    <h5 className="card-header">Your search result for : <strong>{searchQuery}</strong> </h5>
                    <div className="table-responsive text-nowrap">
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-truncate">#</th>
                                    <th className="text-truncate">Buyer</th>
                                    <th className="text-truncate">Style</th>
                                    <th className="text-truncate">Color</th>
                                    <th className="text-truncate">Result</th>
                                    <th className="text-truncate">Create Date</th>
                                    <th className="text-truncate">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* display loading bar before reportList show */}
    
                            </tbody>
                        </table>
                    </div>
    
                </div>
    
            </div>
    );
};

const Sidebar = ({ currentView, handleMenuClick, handleMainMenuClick, activeMainMenuItem, activeMenuItem, user, setUser }) => {

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
const CreateTaskForm = ({ getMessage, setMessage, currentView, setCurrentView, }) => {
    // submitCreateTaskForm
    const submitCreateTaskForm = (e) => {
        e.preventDefault();
        const form = document.getElementById('createTaskForm');
        const formData = new FormData(form);

        // formDataObject is a plain object with key-value pairs
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        fetch('/tasks/create-task/', {
            method: 'POST',
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
                    console.log('Task created successfully');
                } else {
                    console.log('Failed to create task. Status:', data.status);
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
                    <form method="POST" action="" id="createTaskForm" enctype="multipart/form-data" >
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

                    



const App = () => {
    // keep updated buyer in a react state veriable
    const [getMessage, setMessage] = React.useState(null);
    const [currentView, setCurrentView] = React.useState('tasks-list');
    const [activeMenuItem, setActiveMenuItem] = React.useState(null);
    const [activeMainMenuItem, setActiveMainMenuItem] = React.useState(null);

    // search
    const [searchQuery, setSearchQuery] = React.useState('');
    console.log(searchQuery)
    
    // get logged in user details
    const [user, setUser] = React.useState({});
    React.useEffect(() => {
        fetch('/tasks/')
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

    const handleMainMenuClick = (view) => {
        setActiveMainMenuItem(activeMainMenuItem === view ? null : view);
    };


    return (
        <div>
            {/* <!-- Layout wrapper --> */}
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    {/* <!-- Menu --> */}
                    <Sidebar currentView={currentView} setCurrentView={setCurrentView}
                        handleMenuClick={handleMenuClick} handleMainMenuClick={handleMainMenuClick}
                        activeMenuItem={activeMenuItem} activeMainMenuItem={activeMainMenuItem} 
                        user={user} setUser={setUser} 
                        getMessage={getMessage} setMessage={setMessage} 
                        />
                    {/* <!-- / Menu --> */}

                    {/* <!-- Layout container --> */}
                    <div className="layout-page">

                        {/* <!-- Navbar --> */}
                        <Navbar handleMenuClick={handleMenuClick} user={user} setUser={setUser} 
                            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                            currentView={currentView} setCurrentView={setCurrentView} />
                        {/* <!-- / Navbar --> */}

                        {/* <!-- Content wrapper --> */}
                        <div className="content-wrapper">
                            {/* <!-- Content --> */}
                            <div className="container-xxl flex-grow-1 container-p-y">
                                <div className="row gy-4">
                                    
                                    {/* tasks-list */}

                                    {/* tasks-create */}
                                    {currentView === 'tasks-create' && <CreateTaskForm
                                        getMessage={getMessage} setMessage={setMessage}
                                        currentView={currentView} setCurrentView={setCurrentView} />}
                                    
                                    {/* change-password */}
                                    {currentView === 'change-password' && <ChangePassword
                                        getMessage={getMessage} setMessage={setMessage}
                                        currentView={currentView} setCurrentView={setCurrentView} />}
                                    

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