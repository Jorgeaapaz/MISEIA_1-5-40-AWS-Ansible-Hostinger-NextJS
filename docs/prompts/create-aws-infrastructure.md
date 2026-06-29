

# 1. Re-Create AWS VPS

- Run `D:\Master-IA-Dev\05-Bloque5\1-5-10-aws\terraform apply`
- Valiate AWS VPS is up
- Store all required environment variables in .env.production, add at least
   - AWS_VPS_NAME = [vps name]
   - AWS_SSH_ACCESS = [ssh to connect to new VPS]
   - AWS_PUBLIC_IP = [new vps public IP]
- Create .env with placeholders
- Create .env.example with placeholders

# 2. Open AWS Ports

- Use aws-cli with profile `jaap-2026` to
   - Validate VPS has open ports 80 and 443 in the `inbound rules`
   - **if not** Open ports 80 and 443 in the `inbound rules`

# 3. Configure Hostinger DNS for new AWS VPS public IP

- Use Hostinger `dns` skill using profile `C:\Users\jorge\.claude\hostinger-profile.md` to: 
   - Change IP for DNS registry ia.iadevaps.com to [new vps public IP]
   
# 4. Confirmar que el DNS ya propagó a la nueva IP

  - Run `nslookup ia.iadevaps.com`
  - Check we get [new vps public IP] in the response

# 5. Confirmar que los puertos estan abiertos

   - run `nc -zv [new vps public IP] 80`
   - run `nc -zv [new vps public IP] 443`   

# 6. Ansible

   - Update `ansible_host` with new [new vps public IP], find inventory file at "D:\Master-IA-Dev\05-Bloque5\1-5-30-ansible-aws\ansible\inventory.ini"
   - In WSL run: `cd /mnt/d/master-ia-dev/05-Bloque5/1-5-30-ansible-aws/ansible
  ansible-playbook -i inventory.ini playbook.yml`

# 7. Validate certificates and https in cmd console
   
   - Certificado emitido, run `ssh -i C:/ubuntuiso/.ssh/vboxuser ubuntu@3.235.47.30 "sudo certbot certificates"`

   - HTTPS funciona (cmd): Run `curl -I https://ia.iadevaps.com`






