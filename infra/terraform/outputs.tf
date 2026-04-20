output "instance_public_ip" {
  description = "Public IP of the app instance"
  value       = aws_instance.app.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the app instance"
  value       = aws_instance.app.public_dns
}

output "ssh_command" {
  description = "SSH helper command"
  value       = "ssh ubuntu@${aws_instance.app.public_ip}"
}

output "instance_ips" {
  description = "Instance IP addresses"
  value = {
    public_ip  = aws_instance.app.public_ip
    private_ip = aws_instance.app.private_ip
  }
}
