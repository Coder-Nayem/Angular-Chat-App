using Microsoft.AspNetCore.SignalR;

namespace WebApplicationpractice
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);


			builder.Services.AddSignalR(op =>
			{
				op.MaximumReceiveMessageSize = 1024 * 1024 * 2;
			});

			builder.Services.AddCors();


			var app = builder.Build();


			app.UseCors(opt =>
			{
				opt.WithOrigins("https://localhost:4200", "http://localhost:4200")
				.AllowAnyHeader()
				.AllowAnyMethod()
				.AllowCredentials();
			});



			app.MapHub<Messenger>("/mychat");

			//app.MapGet("/", () => "<h1>Hello World!</h1>");

			app.Run();
		}
	}


	public class Messenger : Hub
	{
		public void Send(string username, string message)
		{
			this.Clients.All.SendAsync("Receive", username, message);
		}
		public void SendImg(string username, string img)
		{
			this.Clients.All.SendAsync("ReceiveImg", username, img);
		}
	}
}
