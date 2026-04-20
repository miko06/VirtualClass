variable "project_name" {
  description = "Project name prefix for created resources"
  type        = string
  default     = "virtualclass"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.42.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Public subnet CIDR"
  type        = string
  default     = "10.42.1.0/24"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "ssh_allowed_cidr" {
  description = "CIDR allowed to SSH"
  type        = string
  default     = "0.0.0.0/0"
}

variable "public_key" {
  description = "SSH public key content for EC2 key pair"
  type        = string
}

variable "app_port" {
  description = "Public app port exposed via security group"
  type        = number
  default     = 80
}

variable "ami" {
  description = "AMI ID for EC2 (Ubuntu 22.04 eu-central-1)"
  type        = string
  default     = "ami-0d1ddd83282187d18"
}

variable "tag" {
  description = "The tag for the EC2 instance"
  type        = string
}

variable "availability_zone" {
  description = "The project availability zone"
  type        = string
  default     = "eu-central-1c"
}

variable "location" {
  description = "The project region"
  type        = string
  default     = "eu-central-1"
}
