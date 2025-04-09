FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration file, if necessary
# If you don't have a custom config, Nginx will serve the static files by default
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the outside world
EXPOSE 3001

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]