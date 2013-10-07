function cluster()
{
	this.x = 0.0;
	this.y = 0.0;
	this.dx = 0.0;
	this.dy = 0.0;
	this.angle = 0.0;
	this.speed = 0.0;
	this.direction = 0.0;
	this.objectcluster = new DP_ObCollectionOrdered("id");
	
	this.add = function(inid,inx,iny,indirection,inspeed,indensity,inmass,intemp)
	{
		this.objectcluster.add( new circle(inid,inx,iny,indirection,inspeed,indensity,inmass,intemp));
	};
	this.drop = function(objectid)
	{
		this.objectcluster.drop(objectid);
	};
	this.calcCOG = function()
	{
		if(!this.objectcluster.isEmpty())
		{
			var xSum = 0.0;
			var ySum = 0.0;
			var massSum = 0.0;
			var max_radius = 0.0;
			for(i=0;i<this.objectcluster.getCount();i++)
			{
				xSum += this.objectcluster.getAt(i).x;
				ySum += this.objectcluster.getAt(i).y;
				massSum += this.objectcluster.getAt(i).mass;
			}
			this.x = xSum/this.objectcluster.getCount();
			this.y = ySum/this.objectcluster.getCount();
			xSum = this.x;
			ySum = this.y;
			for(i=0;i<this.objectcluster.getCount();i++)
			{
				xSum += (this.objectcluster.getAt(i).x-this.x)*(this.objectcluster.getAt(i).mass/massSum);
				ySum += (this.objectcluster.getAt(i).y-this.y)*(this.objectcluster.getAt(i).mass/massSum);
			}
			this.x = xSum;
			this.y = ySum;
			/*for(i=0;i<this.objectcluster.getCount();i++)
			{
				max_radius = Math.sqrt(Math.pow((this.objectcluster.getAt(i).x-this.x),2)+Math.pow((this.objectcluster.getAt(i).y-this.y),2));//find the maximum distance
				if(max_radius>this.radius)
				{
					this.radius = max_radius+this.objectcluster.getAt(i).radius;
				}
			}*/
		}
		else
		{
			this.x = 0.0;
			this.y = 0.0;
		}
	};
	this.move = function()
	{
		this.dx = this.speed*Math.cos(((Math.PI/180.0)*this.direction));
		this.dy = this.speed*Math.sin(((Math.PI/180.0)*this.direction));

		var dis = 0.0;
		var ang = 0.0;
		for(i=0;i<this.objectcluster.getCount();i++)
		{
			dis = Math.sqrt(Math.pow(this.objectcluster.getAt(i).x - this.x, 2.0)+Math.pow(this.objectcluster.getAt(i).y - this.y, 2.0));
			ang = (180.0/Math.PI)*(Math.atan2((this.objectcluster.getAt(i).y - this.y),(this.objectcluster.getAt(i).x - this.x)));
			ang = this.direction + (this.direction - ang);//problem
			this.objectcluster.getAt(i).x = this.x+(dis*Math.cos((Math.PI/180.0)*ang));
			this.objectcluster.getAt(i).y = this.y+(dis*Math.sin((Math.PI/180.0)*ang));
			this.objectcluster.getAt(i).move(this.direction, this.speed);
		}
	};
	this.collision = function(other)
	{
		;
	};
	this.resolve = function()
	{
		;
	};
	this.drawMe = function(ctx)
	{
		this.x += this.dx;
		this.y += this.dy;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.arc(this.x,this.y,5.0,0,(Math.PI*2.0),false);
		ctx.closePath();
		ctx.fill();
		for(i=0;i<this.objectcluster.getCount();i++)
		{
			ctx.beginPath();
			for(j=i;j<this.objectcluster.getCount();j++)
			{
				ctx.moveTo(this.objectcluster.getAt(i).x, this.objectcluster.getAt(i).y);
				ctx.lineTo(this.objectcluster.getAt(j).x, this.objectcluster.getAt(j).y);
			}
			ctx.closePath();
			ctx.stroke();
			this.objectcluster.getAt(i).drawMe(ctx);
		}
	};
};

function circle(inid,inx,iny,indirection,inspeed,indensity,inmass,intemp)
{
	this.id = inid;
	this.x = inx;
	this.y = iny;
	this.dx = 0.0;
	this.dy = 0.0;
	this.direction = 0.0;
	this.speed = 0.0;
	this.radius = 0.0;
	this.mass = 0.0;
	this.density = 0.0;
	this.temp = 24.08;

	this.r_dx = new Array();
	this.r_dy = new Array();
	this.r_d = new Array();
	this.collided = false;

	this.move = function(indirection, inspeed)
	{
		this.direction = indirection;
		this.speed = inspeed;
		this.dx = this.speed*Math.cos(((Math.PI/180.0)*this.direction));
		this.dy = this.speed*Math.sin(((Math.PI/180.0)*this.direction));
	};
	this.physical = function(indensity, inmass, intemp)
	{
		this.density = indensity;
		this.mass = inmass;
		this.radius = Math.sqrt(this.mass/(Math.PI*this.density))+((12.0/1000000.0)*Math.sqrt(this.mass/(Math.PI*this.density))*(intemp - this.temp));
	};
	this.collision = function(other)
	{
		var c_distance = Math.sqrt(Math.pow((other.x-this.x),2.0)+Math.pow((other.y-this.y),2.0));
		if(c_distance<=((other.radius+other.speed)+(this.radius+this.speed)))
		{
			var normal_angle = 0.0;
			var incident_angle = 0.0;
			if(this.speed==0.0)
			{
				this.r_d.push((180.0/Math.PI)*(Math.atan2((-1.0*(other.y-this.y)),(-1.0*(other.x-this.x)))));
			}
			else
			{
				normal_angle = (180.0/Math.PI)*(Math.atan2((-1.0*(other.y-this.y)),(-1.0*(other.x-this.x))));
				incident_angle = (180.0/Math.PI)*(Math.atan2(((-this.radius)*Math.sin(((Math.PI/180.0)*this.direction))),((-this.radius)*Math.cos(((Math.PI/180.0)*this.direction)))));
				this.r_d.push(normal_angle + (normal_angle - incident_angle));
			}
			this.r_dx.push((this.dx*(this.mass-other.mass)+2.0*(other.mass*other.dx))/(this.mass+other.mass));
			this.r_dy.push((this.dy*(this.mass-other.mass)+2.0*(other.mass*other.dy))/(this.mass+other.mass));
			this.collided = true;
		}
	};
	this.resolve = function()
	{
		if(this.collided == true)
		{
			var sum_r_dx = 0.0;
			var sum_r_dy = 0.0;
			var sum_r_d = 0.0;
			for(i=0.0;i<this.r_dx.length;i++)
			{
				sum_r_dx += this.r_dx[i];
				sum_r_dy += this.r_dy[i];
				sum_r_d += this.r_d[i];
			}
			sum_r_d = sum_r_d/this.r_d.length;
			this.r_dx.splice(0, this.r_dx.length);
			this.r_dy.splice(0, this.r_dy.length);
			this.r_d.splice(0, this.r_d.length);
			this.move(sum_r_d,Math.sqrt(Math.pow(sum_r_dx,2.0)+Math.pow(sum_r_dy,2.0)));
			this.collided = false;
		}
	};
	this.drawMe = function(c)
	{
		//check if the objects im connected to are colliding with me
		this.x += this.dx;
		this.y += this.dy;

		c.beginPath();
		c.moveTo(this.x+this.radius, this.y);
		c.arc(this.x,this.y,this.radius,0,(Math.PI*2.0),false);
		c.closePath();
		c.stroke();
	};
	this.move(indirection, inspeed);
	this.physical(indensity, inmass, intemp);
};