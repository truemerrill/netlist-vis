FROM python:3.12-slim

WORKDIR /app

# Update apt
RUN apt-get update && apt-get install -y build-essential

# Copy code to app
COPY README.md /app/
COPY pyproject.toml /app/
COPY src/ /app/src/

# Install
RUN pip install .

# Open port
EXPOSE 8000

CMD ["uvicorn", "netlist_vis_backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

