## Motivation  
Many cities are poorly lit or have crime hotspots that aren't obvious to pedestrians. **LumenWalk** was built at the first london hackathon for **{tech: europe}** to provide AI-assisted routing for safer walking paths at night — combining open safety data, lighting info, and map intelligence to guide users in London along better routes.

<br>
<br>
<br>

## LumenWalk Architecture

![LumenWalk Architecture](/lumenwalk/lumenwalk.gif)

This diagram shows how LumenWalk is deployed on AWS EC2 using Docker and NGINX. GitHub Actions handles CI/CD, and external services like Umami and Sentry provide analytics and error tracking. HTTPS is secured using Certbot, and uptime is monitored via UptimeRobot.

<br>
<br>
<br>

## Infrastructure Stack

| Component         | Tool/Service                |
|-------------------|-----------------------------|
| Hosting           | AWS EC2 (Ubuntu)            |
| Web Server        | NGINX + Certbot (HTTPS)     |
| Containers        | Docker                      |
| CI/CD             | GitHub Actions (SSH deploy) |
| Monitoring        | UptimeRobot (5-min pings)   |
| Analytics         | Umami                       |
| Error Tracking    | Sentry                      |
| Domain / DNS      | Route 53 + Custom Domain    |

<br>
<br>
<br>

## Observability and Uptime

- **Uptime Monitoring:** UptimeRobot checks `/api/status` every 5 minutes.
- **Analytics:** Umami tracks frontend usage.
- **Error Tracking:** Sentry logs backend exceptions.

**Uptime Screenshot**
![Monitoring Screenshot](/lumenwalk/uptimerobot2.png)

<br>
<br>
<br>

## Key Features  
- AI-powered route recommendations based on safety and lighting data  
- Interactive Mapbox interface with live route rendering  
- Integration with OpenAI to summarise route risks in plain language  
- Real-time data from Metro Police and lighting APIs  
- Shareable routes — users can send a link to others who can view the route and submit safety feedback  
- Feedback is stored in a database for future analysis  
- Fully Dockerised and deployed to AWS with HTTPS and monitoring  

<br>
<br>
<br>

## 📝 Deployment Workflow

1. Push to `main` triggers **GitHub Actions**.

2. Pipeline:
   - Logs into Docker Hub
   - Pulls latest image
   - Stops & removes old container
   - Runs latest container
   - Cleans up unused images/volumes

3. **UptimeRobot** monitors deployment health.

<br>
<br>
<br>

## **Terminal Logs** – Proving cleanup and recovery from crash:

Below I have snippets from my GitHub Actions Workflow logs and my EC2 instance during an instance crash.

### EC2 Running Out of Disk Space During Deployment

```bash
out: Disk space before build:
out: Filesystem      Size  Used Avail Use% Mounted on
out: /dev/root       9.6G  8.6G  929M  91% /
out: tmpfs           479M     0  479M   0% /dev/shm
out: tmpfs           192M  892K  191M   1% /run
out: tmpfs           5.0M     0  5.0M   0% /run/lock
out: /dev/xvda15     105M  6.1M   99M   6% /boot/efi
out: tmpfs            96M  4.0K   96M   1% /run/user/1000
```
The EC2 instance (t3.micro – 10GB disk) was already 91% full before the deployment started.

### During Build - Error

```bash
out: 1f0407f2dd82: Download complete
err: failed to register layer: write /app/node_modules/@types/tedious/index.d.ts: no space left on device
```
While pulling the latest container from DockerHub, the instance ran out of disk space and the deployment failed. 

### Diagnosis & Fix 

```bash
ubuntu@ec2-instance:~$ df -h
/dev/root       9.6G  8.6G  929M  91% /
...
docker image prune -a -f
Total reclaimed space: 2.763GB
```
I checked the system and found that old, unused Docker images were piling up after each build.
Removing them freed almost 3GB of space, restoring the instance to a healthy state.



<br>
<br>
<br>

## 🧠 Key DevOps Learnings

1. **Infrastructure Visualization** – Learned to map components visually with draw.io and show external tools (monitoring, analytics) *outside* the EC2 boundary.

2. **Disk Space Management** – EC2 crashed due to unused Docker images. Fixed with:
   ```bash
   docker image prune -a -f
   ```
   and integrated a cleanup step into my CI workflow.
3. **Reverse Proxy Setup** – Configured NGINX to route traffic to Dockerised frontend and secure HTTPS with Certbot.

4. **CI/CD Automation** – GitHub Actions auto-deploys new builds to EC2 via SSH.

