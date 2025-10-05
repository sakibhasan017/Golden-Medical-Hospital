# Golden Medical Hospital

## Team Name: Top-G

ICT 8, Department of Information and Communication Engineering, Bangladesh University of Professionals, Bangladesh

## Team Members:

1.  Shihaful Islam Ornob (2254901012)
2.  Md. Mahadi Hasan Shakib (2254901020)
3.  Md. Shahrukh Hossain (2254901054)
4.  Md. Sakib Hasan (2254901060)
5.  Shameha Fatema Shemonty (2254901092)

# How to Use

## 1\. Clone the project

- Install git bash
- Open your local directory's git bash terminal
- `git config --global user.name <github_username>`
  `git config --global user.email <github_email> `
- Run command:git clone https://github.com/sakibhasan017/Golden-Medical-Hospital.git

## 2\. Navigate to the project directory commands

- Navigate:`cd Golden-Medical-Hospital`
- Open VS Code:`code .`
- Open terminal:Ctrl + J

## 3\. Install Dependencies:

    ```bash
    # Install frontend dependencies
    cd frontend
    npm install
    # Install backend dependencies
    cd ../backend
    npm install
    ```
4\. Setup environment:
--------------------

- Create a `.env` file in both `frontend` and `backend` directories.
- Configure:
     - MongoDB connection string :
     - JWT secret key : 

## 5\. Run the Project:
--------------------

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```
- Visit: <a href="http://localhost:5173">http://localhost:5173</a>

# How to Develop

## 1\. Create a new branch:

- Run command: `git checkout -b <new-branch-name>`

## 2\. Make Changes:

- Implement new features or fix bugs.

- For database schema changes, update Mongoose models.

## 3\. Commit and Push Changes:

```bash 
 git add .
 git commit -m "Description of changes"
 git push origin <new_branch_name>

```

## 4\. Create a Pull Request:

- Open a Pull Request from your feature branch to the main branch.
- [Watch this](https://youtu.be/8lGpZkjnkt4?si=wWhlt5uIpKkMVsMT)
- Team members will review your code.


## 5\. Merge and Update:

- Collaborators will review changes in the Pull Request.
- If approved, merge changes into the main branch.
- [Watch this](https://youtu.be/OVQK2zzb6U8?si=5dcqy_z1v0TbbdLS)
- Then Update
```bash 
git checkout main
git pull origin main
git branch -d <new_branch_name>          # delete local branch
git push origin --delete <branch_name>   # delete remote branch (optional)

```

