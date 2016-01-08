FROM ubuntu:14.04
MAINTAINER James C. Scott III <jcscott.iii@gmail.com>

RUN apt-get install -y wget

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
	echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list

# Update packages
RUN apt-get update

RUN apt-get install -y \
	jwm \
	x11vnc \
	xvfb \
	git \
	zip \
	google-chrome-stable

ENV HOME /root

RUN mkdir $HOME/workplace

ENV GOPATH $HOME/workplace
ENV GOROOT $HOME/go
ENV CODEPATH $GOPATH/src/github.com/18F/cg-deck

RUN wget https://storage.googleapis.com/golang/go1.5.2.linux-amd64.tar.gz -O $HOME/go.tar.gz
RUN mkdir $HOME/go && tar -C $HOME -xzf $HOME/go.tar.gz && rm $HOME/go.tar.gz
RUN ln -s $HOME/go/bin/go /bin/go

# download chromedriver
RUN wget http://chromedriver.storage.googleapis.com/2.20/chromedriver_linux64.zip && unzip chromedriver_linux64.zip -d /bin

WORKDIR $CODEPATH
COPY . $CODEPATH

EXPOSE 5900

CMD x11vnc -forever -create
