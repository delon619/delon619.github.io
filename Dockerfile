FROM nginx:alpine

# Copy semua file static ke folder nginx
COPY . /usr/share/nginx/html

# Copy konfigurasi nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
