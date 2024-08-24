resource "aws_s3_bucket" "my_s3_bucket" {
    bucket = "s3-bucket-blog-mvc-customhaven"
}

resource "aws_s3_bucket_versioning" "bucket_versioning" {
    bucket = aws_s3_bucket.my_s3_bucket.id
    versioning_configuration {
        status = "Enabled"
    }
}